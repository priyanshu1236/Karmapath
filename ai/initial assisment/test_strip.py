import json
from app.assessment.llm_question_generator import generate_interest_questions

# Mock the genai model
class MockResponse:
    text = """```json
[
  {
    "id": "AI-GEN-001",
    "question": "What is AI?",
    "options": {
      "A": "Artificial Intelligence",
      "B": "Apple Inc",
      "C": "Air India",
      "D": "All In"
    },
    "correct_answer": "A",
    "competency_id": "COMP-OFFICE-PROCEDURES"
  },
  {
    "id": "AI-GEN-002",
    "question": "What is ML?",
    "options": {
      "A": "Machine Learning",
      "B": "Maximum Likelihood",
      "C": "Minimum Loss",
      "D": "Mean Loss"
    },
    "correct_answer": "A",
    "competency_id": "COMP-OFFICE-PROCEDURES"
  },
  {
    "id": "AI-GEN-003",
    "question": "What is DL?",
    "options": {
      "A": "Deep Learning",
      "B": "Data Link",
      "C": "Deep Link",
      "D": "Data Layer"
    },
    "correct_answer": "A",
    "competency_id": "COMP-OFFICE-PROCEDURES"
  }
]
```"""

class MockModel:
    def generate_content(self, prompt):
        return MockResponse()

import google.generativeai as genai
import os
os.environ["GEMINI_API_KEY"] = "fake"
genai.GenerativeModel = lambda *args, **kwargs: MockModel()

import sys
sys.path.append("/home/priyanshu/dev/sih/ai/initial assisment")
from app.assessment.llm_question_generator import generate_interest_questions

comps = [{"id": "COMP-OFFICE-PROCEDURES", "name": "Office Procedures"}]
q = generate_interest_questions("Statistical Officer", "AI", comps)
print(f"Generated {len(q)} questions.")
