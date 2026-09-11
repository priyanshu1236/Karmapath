import json
import requests
import os
import sys

# 1. Trigger generate to create the temp file with AI answers
print("Triggering /generate to create temp file...")
gen_url = "http://localhost:8000/api/assessment/generate?role=Statistical%20Officer&domain=Agricultural%20Statistics&employee_id=EMP_INT_TEST&area_of_interest=Artificial%20Intelligence"
gen_res = requests.get(gen_url)
print(f"Generate status: {gen_res.status_code}")
gen_data = gen_res.json()
print(f"Questions returned: {len(gen_data.get('questions', []))}")

ai_questions = [q for q in gen_data.get("questions", []) if q["id"].startswith("AI-GEN-")]
print(f"AI questions found: {len(ai_questions)}")

# Read the scratch file to get the correct answers to simulate them
scratch_path = "/home/priyanshu/dev/sih/ai/initial assisment/scratch/EMP_INT_TEST_interest.json"
try:
    with open(scratch_path, "r") as f:
        scratch_data = json.load(f)
    print("Successfully read scratch file!")
    
    # Let's get 1 correct and the rest wrong to simulate 33% or something
    answers = {}
    for i, q in enumerate(scratch_data.get("questions", [])):
        if i == 0:
            answers[q["id"]] = q["correct_answer"]
        else:
            answers[q["id"]] = "Z" # wrong answer
            
    print("Mock answers for AI questions:", answers)
    
except Exception as e:
    print("Failed to read scratch file:", e)
    sys.exit(1)

# Add some mock standard answers
answers["STAT-AS-001"] = "A"

# 2. Trigger evaluate
eval_payload = {
    "employee_id": "EMP_INT_TEST",
    "assessment_id": "ASSESS-001",
    "role": "Statistical Officer",
    "domain": "Agricultural Statistics",
    "answers": answers
}

print("\nTriggering /evaluate...")
eval_url = "http://localhost:8000/api/assessment/evaluate"
eval_res = requests.post(eval_url, json=eval_payload)
print(f"Evaluate status: {eval_res.status_code}")

if eval_res.status_code == 200:
    eval_data = eval_res.json()
    print("\n--- interest_assessment ---")
    print(json.dumps(eval_data.get("interest_assessment"), indent=2))
    
    print("\n--- development_gaps ---")
    gaps = eval_data.get("development_gaps", [])
    interest_gaps = [g for g in gaps if g.get("source") == "area_of_interest"]
    print(f"Total gaps: {len(gaps)}")
    print("Interest gaps in development_gaps:", json.dumps(interest_gaps, indent=2))
    
    print("\n--- recommendations ---")
    recs = eval_data.get("recommendations", [])
    print(f"Total recommendations: {len(recs)}")
    
else:
    print("Error:", eval_res.text)
