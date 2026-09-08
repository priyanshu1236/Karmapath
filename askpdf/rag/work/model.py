from dotenv import load_dotenv
load_dotenv()
import os
import json
import time
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.vectorstores import Chroma


pdf_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "backend", "uploads", "lelm107.pdf")
if not os.path.exists(pdf_path):
    pdf_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "backend", "uploads", "lelm107.pdf")
if not os.path.exists(pdf_path):
    pdf_path = "/Users/abhaypratapsingh/Desktop/askpdf/backend/uploads/lelm107.pdf"

loader = PyPDFLoader(pdf_path)
documents = loader.load()
print("Pages:", len(documents))

splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=150
)
chunks = splitter.split_documents(documents)

embeddings = GoogleGenerativeAIEmbeddings(
    model="gemini-embedding-001",
    google_api_key=os.getenv("GEMINI_API_KEY")
)
vector_stores = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="./chroma.db"
)
print("Vector store created successfully")

group_size = 12
groups = []
for i in range(0, len(chunks), group_size):
    groups.append(chunks[i:i + group_size])
print("Groups:", len(groups))

# response_mime_type forces the model to return valid JSON only,
# instead of hoping it follows the "Return JSON only" instruction in the prompt.
llm = ChatGoogleGenerativeAI(
    model="gemini-3.6-flash",
    google_api_key=os.getenv("GEMINI_API_KEY"),
    generation_config={"response_mime_type": "application/json"},
    timeout=60  # fail fast instead of hanging indefinitely on a slow/stuck call
)

PROMPT_TEMPLATE = """
You are creating a quiz from a PDF.

Generate exactly 4 multiple-choice questions from
the content below.

Rules:
- Use ONLY the provided content.
- Do not use outside knowledge.
- Each question must have exactly 4 options.
- Exactly one option must be correct.
- Questions should test different concepts.
- Do not make questions about information that is
  not explicitly present in the content.

Return a JSON array. Each item must look like:
{{
  "question": "...",
  "options": ["...", "...", "...", "..."],
  "correct_answer": "..."
}}

CONTENT:
{content}
"""

all_questions = []

for idx, group in enumerate(groups):
    group_text = "\n\n".join(chunk.page_content for chunk in group)
    prompt = PROMPT_TEMPLATE.format(content=group_text)

    print(f"Group {idx + 1}/{len(groups)}: sending request...")
    try:
        response = llm.invoke(prompt)

        # response.content can be a plain string OR a list of content blocks
        # (e.g. [{"type": "text", "text": "..."}]) depending on the model/mode.
        # Normalize to a plain string either way.
        content = response.content
        if isinstance(content, list):
            parts = []
            for block in content:
                if isinstance(block, str):
                    parts.append(block)
                elif isinstance(block, dict):
                    parts.append(block.get("text", ""))
            raw = "".join(parts).strip()
        else:
            raw = content.strip()

        # In case the model still wraps output in ```json fences
        if raw.startswith("```"):
            raw = raw.strip("`")
            if raw.startswith("json"):
                raw = raw[4:]
            raw = raw.strip()

        questions = json.loads(raw)
        all_questions.extend(questions)
        print(f"Group {idx + 1}/{len(groups)}: got {len(questions)} questions")

    except json.JSONDecodeError:
        print(f"Group {idx + 1}/{len(groups)}: could not parse JSON, skipping")
    except Exception as e:
        print(f"Group {idx + 1}/{len(groups)}: error - {e}, skipping")

    # Small delay to avoid hitting rate limits on free-tier keys
    time.sleep(1)

print("\n========== GENERATED QUESTIONS ==========\n")
for i, q in enumerate(all_questions, start=1):
    print(f"Q{i}. {q.get('question')}")
    for opt in q.get("options", []):
        print(f"   - {opt}")
    print(f"   Answer: {q.get('correct_answer')}\n")

print(f"Total questions generated: {len(all_questions)}")
print("\n========== END ==========\n")

# Optional: save to a JSON file so you can load it into a frontend quiz UI
with open("quiz_output.json", "w") as f:
    json.dump(all_questions, f, indent=2)
print("Saved to quiz_output.json")