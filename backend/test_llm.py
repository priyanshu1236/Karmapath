from dotenv import load_dotenv
load_dotenv()
import sys
from pathlib import Path
import importlib.util

AI_DIR = Path(__file__).resolve().parent.parent / "ai" / "initial assisment"
spec = importlib.util.spec_from_file_location("llm_gen", str(AI_DIR / "app" / "assessment" / "llm_question_generator.py"))
llm_gen = importlib.util.module_from_spec(spec)
sys.modules["llm_gen"] = llm_gen
spec.loader.exec_module(llm_gen)

comp_list = [{"id": "COMP-001", "name": "Python / Data Analysis"}]
q = llm_gen.generate_interest_questions("Statistical Officer", "Cybersecurity", comp_list)
print("Questions generated:", len(q))
