import google.generativeai as genai
import os
import json
import logging

logger = logging.getLogger(__name__)

def generate_interest_questions(role, area_of_interest):
    """
    Generates 3-4 personalized assessment questions based on the user's area of interest.
    Uses Gemini API and falls back to an empty list on failure.
    """
    try:
        api_key = os.environ.get("GEMINI_API_KEY")
        print("[LLM] generator called")
        print("[LLM] area_of_interest:", area_of_interest)
        print("[LLM] API key configured:", bool(api_key))
        logger.info(f"GEMINI_API_KEY configured: {'YES' if api_key else 'NO'}")
        
        if not api_key:
            logger.error("GEMINI_API_KEY not set. Skipping LLM generation.")
            return []
            
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-3.5-flash', generation_config={"response_mime_type": "application/json"})
        
        prompt = f"""You are generating assessment questions for an employee.

Role:
{role}

Area of Interest:
{area_of_interest}

Generate 3 to 4 multiple-choice assessment questions.

Rules:
1. Each question must have exactly 4 options: A, B, C, D.
2. There must be exactly one correct answer.
3. Every question must be directly related to the user's Area of Interest.
4. The interest can be completely different from their current role (e.g. they might want a career switch). Generate beginner-to-intermediate questions related to their Area of Interest.
5. Return JSON only, matching the exact format below. Do not include markdown formatting (like ```json), just the raw JSON array.
6. Do not include explanations.

Format your response as a JSON array of objects:
[
  {{
    "id": "AI-GEN-001",
    "question": "Question text",
    "options": {{
      "A": "Option A text",
      "B": "Option B text",
      "C": "Option C text",
      "D": "Option D text"
    }},
    "correct_answer": "B"
  }}
]
"""
        logger.info("Sending request to Gemini model...")
        
        response = model.generate_content(prompt)
        logger.info("Received response from Gemini model.")
        
        logger.info(f"RAW LLM RESULT:\n{response.text}")
        
        content = response.text.strip()
        
        if content.startswith("```json"):
            content = content[7:]
        elif content.startswith("```"):
            content = content[3:]
            
        if content.endswith("```"):
            content = content[:-3]
            
        content = content.strip()
        
        # Parse and validate
        logger.info(f"PARSED RESULT (before JSON parsing):\n{content}")
        questions = json.loads(content)
        
        print("[LLM] raw response:", response.text)
        print("[LLM] parsed questions:", len(questions))
        print("[LLM] question IDs:", [q.get("id") for q in questions])
        
        if not isinstance(questions, list):
            raise ValueError("Response is not a JSON array")
            
        if not (3 <= len(questions) <= 4):
            raise ValueError(f"Generated {len(questions)} questions, expected 3-4")
            
        logger.info(f"VALIDATED RESULT (parsed length): {len(questions)}")
            
        validated_questions = []
        
        for i, q in enumerate(questions):
            # Validate structure
            if not all(k in q for k in ['question', 'options', 'correct_answer']):
                raise ValueError("Missing required fields in question")
                
            if len(q['options']) != 4:
                raise ValueError("Question does not have exactly 4 options")
                
            if not all(k in q['options'] for k in ['A', 'B', 'C', 'D']):
                raise ValueError("Options keys are not A, B, C, D")
                
            if q['correct_answer'] not in ['A', 'B', 'C', 'D']:
                raise ValueError("Correct answer is not A, B, C, or D")
                
            # Assign unique ID
            q['id'] = f"AI-GEN-{i+1}"
            
            # Map competency directly to the area of interest
            q['competency_id'] = "COMP-INTEREST"
            q['competency'] = area_of_interest
            q['category'] = "Area of Interest"
            q['difficulty'] = "medium"
            q['marks'] = 1
            
            validated_questions.append(q)
            
        return validated_questions
    except Exception as e:
        logger.error(f"LLM GENERATION ERROR: {repr(e)}")
        raise e
