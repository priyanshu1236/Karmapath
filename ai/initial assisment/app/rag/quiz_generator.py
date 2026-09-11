import os
import json
import time
import uuid
import logging
import random
import re

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.vectorstores import Chroma

logger = logging.getLogger(__name__)

PROMPT_TEMPLATE = """
You are an expert educational assessment creator.

Generate exactly {target_count} multiple-choice questions from the provided PDF content.

TARGET ROLE: {role}
TARGET COMPETENCY: {competency}
(Ensure the questions evaluate knowledge relevant to this competency based on the PDF content, but DO NOT inject outside knowledge just because of the competency name).

Rules:
1. GROUNDING: Use ONLY the provided content. Do not use general world knowledge. Every question must be directly answerable from the text.
2. FORMAT: Each question must have exactly 4 options. Exactly one option must be correct.
3. VARIETY: Generate a balanced mix of question types (e.g., factual, definition, comparison, scenario, process/order). Do not make every question a simple definition.
4. DISTRACTORS: Incorrect options must be plausible, relate to the same topic, and reflect common misconceptions. Do NOT use obviously wrong distractors like "None of the above" or "Something unrelated" unless explicitly used in the text.
5. SPREAD: Cover different sections and topics in the provided text.
6. DIFFICULTY: Aim for a mix of 30% Easy, 50% Medium, and 20% Hard questions.

Return a JSON array where each item matches this exact schema:
[
  {{
    "question": "...",
    "options": ["...", "...", "...", "..."],
    "correct_answer": "...",
    "difficulty": "easy"
  }}
]

CONTENT:
{content}
"""

REGENERATION_PROMPT = """
You are an expert educational assessment creator.
We previously generated some questions from the provided PDF, but we still need exactly {deficit} MORE multiple-choice questions.

TARGET ROLE: {role}
TARGET COMPETENCY: {competency}

Previously Generated Questions (DO NOT REPEAT THESE CONCEPTS):
{existing_questions_text}

Rules:
1. GROUNDING: Use ONLY the provided content. Do not use general world knowledge.
2. FORMAT: Each question must have exactly 4 options. Exactly one option must be correct.
3. VARIETY: Generate a balanced mix of question types.
4. DISTRACTORS: Plausible and realistic.
5. SPREAD: Cover sections/topics that are not yet represented in the previously generated questions.

Return a JSON array of exactly {deficit} items:
[
  {{
    "question": "...",
    "options": ["...", "...", "...", "..."],
    "correct_answer": "...",
    "difficulty": "medium"
  }}
]

CONTENT:
{content}
"""

def normalize_text(text: str) -> str:
    return re.sub(r'[^a-z0-9]', '', str(text).lower())

def adapt_quiz_to_sih_format(generated_questions: list, resource_metadata: dict, existing_normalized_questions: set = None, start_idx: int = 1) -> tuple[list, set]:
    """
    Adapts the raw generated questions into the SIH evaluator schema and filters duplicates.
    """
    if existing_normalized_questions is None:
        existing_normalized_questions = set()
        
    resource_id = resource_metadata.get("resource_id")
    if not resource_id:
        resource_id = f"RES-TEMP-{uuid.uuid4().hex[:6].upper()}"
        
    competency_id = resource_metadata.get("competency_id", "RESOURCE")
    competency = resource_metadata.get("competency", "RESOURCE")
    domain = resource_metadata.get("domain", "General")
    
    adapted_questions = []
    current_idx = start_idx
    
    for q in generated_questions:
        try:
            raw_q = str(q.get("question", "")).strip()
            norm_q = normalize_text(raw_q)
            if not norm_q or len(norm_q) < 10:
                logger.warning(f"Rejecting question: Text too short or empty. {q}")
                continue
                
            if norm_q in existing_normalized_questions:
                logger.warning(f"Rejecting question: Duplicate question detected. {raw_q}")
                continue
                
            raw_options = q.get("options", [])
            if isinstance(raw_options, dict):
                raw_options = list(raw_options.values())
                
            if not isinstance(raw_options, list) or len(raw_options) != 4:
                logger.warning(f"Rejecting question: Does not have exactly 4 options. {q}")
                continue
                
            # Check options length
            if any(len(str(opt).strip()) == 0 for opt in raw_options):
                logger.warning(f"Rejecting question: Empty options found. {q}")
                continue
                
            raw_correct = str(q.get("correct_answer", "")).strip()
            
            option_keys = ["A", "B", "C", "D"]
            sih_options = {}
            sih_correct_key = None
            
            for key, opt_text in zip(option_keys, raw_options):
                opt_text_clean = str(opt_text).strip()
                sih_options[key] = opt_text_clean
                if opt_text_clean.lower() == raw_correct.lower():
                    sih_correct_key = key
                    
            if not sih_correct_key and len(raw_correct) >= 1:
                for k in option_keys:
                    if raw_correct.upper() == k or raw_correct.upper().startswith(k + ".") or raw_correct.upper().endswith(" " + k):
                        sih_correct_key = k
                        break
                        
            if not sih_correct_key:
                logger.warning(f"Rejecting question: Correct answer '{raw_correct}' could not be mapped. {q}")
                continue
                
            existing_normalized_questions.add(norm_q)
            
            difficulty = str(q.get("difficulty", "medium")).lower()
            if difficulty not in ["easy", "medium", "hard"]:
                difficulty = "medium"
                
            question_id = f"{resource_id}-Q{current_idx:03d}"
            
            adapted_q = {
                "id": question_id,
                "question_text": raw_q,
                "options": sih_options,
                "correct_answer": sih_correct_key,
                "competency_id": competency_id,
                "competency": competency,
                "domain": domain,
                "category": "Resource",
                "skill": "Comprehension",
                "difficulty": difficulty,
                "marks": 1
            }
            adapted_questions.append(adapted_q)
            current_idx += 1
            
        except Exception as e:
            logger.error(f"Error adapting question {q}: {e}")
            continue
            
    return adapted_questions, existing_normalized_questions

def parse_llm_json(raw: str) -> list:
    if raw.startswith("```"):
        raw = raw.strip("`")
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()
        
    try:
        questions = json.loads(raw)
    except json.JSONDecodeError:
        return []
        
    if isinstance(questions, dict):
        if "questions" in questions:
            questions = questions["questions"]
        elif "quiz" in questions:
            questions = questions["quiz"]
        elif "question" in questions and "options" in questions:
            questions = [questions]
        else:
            for val in questions.values():
                if isinstance(val, list) and len(val) > 0 and isinstance(val[0], dict):
                    questions = val
                    break
                    
    if isinstance(questions, list):
        return questions
    return []

def call_llm(prompt: str, api_key: str) -> list:
    llm = ChatGoogleGenerativeAI(
        model="gemini-3.5-flash",
        google_api_key=api_key,
        generation_config={"response_mime_type": "application/json"},
        timeout=60
    )
    
    try:
        response = llm.invoke(prompt)
        content = response.content
        if isinstance(content, list):
            parts = [block if isinstance(block, str) else block.get("text", "") for block in content]
            raw = "".join(parts).strip()
        else:
            raw = content.strip()
            
        return parse_llm_json(raw)
    except Exception as e:
        logger.error(f"LLM call failed: {e}")
        return []

def generate_quiz_from_pdf(pdf_path: str, resource_metadata: dict | None = None) -> dict:
    if not resource_metadata:
        resource_metadata = {}
        
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF file not found: {pdf_path}")
        
    logger.info(f"Loading PDF from {pdf_path}")
    loader = PyPDFLoader(pdf_path)
    documents = loader.load()
    
    if not documents:
        raise ValueError("No text could be extracted from the PDF.")
        
    total_length = sum(len(d.page_content) for d in documents)
    logger.info(f"Extracted {len(documents)} pages. Total length: {total_length} characters.")
    
    if total_length < 20000:
        target_count = random.randint(5, 8)
    elif total_length < 60000:
        target_count = random.randint(8, 12)
    else:
        target_count = random.randint(12, 15)
        
    logger.info(f"Target question count set to {target_count}.")
    
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
    chunks = splitter.split_documents(documents)
    logger.info(f"Split into {len(chunks)} chunks.")
    
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is not set.")
        
    if total_length <= 80000:
        selected_text = "\n\n".join(chunk.page_content for chunk in chunks)
    else:
        # Retrieve chunks for broader, relevant coverage
        embeddings = GoogleGenerativeAIEmbeddings(model="gemini-embedding-001", google_api_key=api_key)
        persist_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "chroma.db")
        vector_stores = Chroma.from_documents(documents=chunks, embedding=embeddings, persist_directory=persist_dir)
        
        competency = resource_metadata.get("competency", "general")
        role = resource_metadata.get("role", "employee")
        query = f"Key concepts, definitions, methods, and examples related to {competency} for a {role}"
        
        relevant_docs = vector_stores.similarity_search(query, k=15)
        sampled_docs = random.sample(chunks, min(len(chunks), 15))
        
        # Deduplicate chunks by content
        combined = {d.page_content: d for d in relevant_docs + sampled_docs}.values()
        selected_text = "\n\n".join(d.page_content for d in combined)
        
    role = resource_metadata.get("role", "General Role")
    competency = resource_metadata.get("competency", "General Competency")
    
    # FIRST PASS
    prompt = PROMPT_TEMPLATE.format(
        target_count=target_count,
        role=role,
        competency=competency,
        content=selected_text
    )
    
    logger.info("Executing FIRST pass LLM call...")
    raw_questions = call_llm(prompt, api_key)
    logger.info(f"First pass generated {len(raw_questions)} raw questions.")
    
    final_questions = []
    normalized_set = set()
    
    adapted_q, normalized_set = adapt_quiz_to_sih_format(raw_questions, resource_metadata, normalized_set, start_idx=1)
    final_questions.extend(adapted_q)
    
    logger.info(f"First pass yielded {len(adapted_q)} valid questions.")
    
    # REGENERATION PASS (if needed)
    deficit = target_count - len(final_questions)
    if deficit > 0:
        logger.info(f"Target count not reached (deficit: {deficit}). Attempting regeneration...")
        existing_text = "\n".join([f"- {q['question_text']}" for q in final_questions])
        
        regen_prompt = REGENERATION_PROMPT.format(
            deficit=deficit,
            role=role,
            competency=competency,
            existing_questions_text=existing_text,
            content=selected_text
        )
        
        raw_regen = call_llm(regen_prompt, api_key)
        logger.info(f"Regeneration pass generated {len(raw_regen)} raw questions.")
        
        adapted_regen, normalized_set = adapt_quiz_to_sih_format(raw_regen, resource_metadata, normalized_set, start_idx=len(final_questions)+1)
        final_questions.extend(adapted_regen)
        
        logger.info(f"Regeneration pass yielded {len(adapted_regen)} valid questions.")
        
    logger.info(f"Final quiz generation complete. Total valid questions: {len(final_questions)} (Target: {target_count})")
    
    resource_id = resource_metadata.get("resource_id", "RES-TEMP")
    if final_questions and final_questions[0]["id"].startswith("RES-TEMP"):
        resource_id = final_questions[0]["id"].split("-Q")[0]
        
    return {
        "resource_id": resource_id,
        "questions": final_questions
    }
