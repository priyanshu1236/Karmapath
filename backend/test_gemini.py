import os
import asyncio
import google.generativeai as genai
from importlib.util import spec_from_file_location, module_from_spec

spec = spec_from_file_location("llm", "/home/priyanshu/dev/sih/ai/initial assisment/app/assessment/llm_question_generator.py")
llm = module_from_spec(spec)
spec.loader.exec_module(llm)

print("Key:", bool(os.environ.get("GEMINI_API_KEY")))
try:
    res = llm.generate_interest_questions("Statistical Officer", "Data Analysis")
    print(len(res))
except Exception as e:
    print("Error:", e)
