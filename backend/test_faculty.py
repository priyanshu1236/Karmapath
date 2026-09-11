import requests
import json
import time

BASE_URL = "http://localhost:8000/api/assessment"
EMPLOYEE_ID = "FAC001"

def test_assessment(test_name, role, interest):
    print(f"\n--- {test_name} ---")
    print(f"Role: {role}, Interest: {interest}")
    
    params = {
        "role": role,
        "domain": "Education",
        "employee_id": EMPLOYEE_ID,
    }
    if interest:
        params["area_of_interest"] = interest
        
    res = requests.get(f"{BASE_URL}/generate", params=params)
    if res.status_code != 200:
        print("GENERATE FAILED:", res.text)
        return
        
    data = res.json()
    questions = data.get('questions', [])
    
    print(f"Total questions generated: {len(questions)}")
    
    interest_questions = [q for q in questions if str(q['id']).startswith('AI-GEN')]
    print(f"Interest questions: {len(interest_questions)}")
    
    # Submit answers
    answers = {}
    for i, q in enumerate(questions):
        options = q.get('options', {})
        answers[q['id']] = list(options.keys())[0] if options else "A"
        
    payload = {
        "employee_id": EMPLOYEE_ID,
        "assessment_id": data.get('assessment_id', 'test'),
        "answers": answers,
        "role": role,
        "domain": "Education",
        "area_of_interest": interest if interest else ""
    }
    
    eval_res = requests.post(f"{BASE_URL}/evaluate", json=payload)
    if eval_res.status_code != 200:
        print("EVALUATE FAILED:", eval_res.text)
        return
        
    eval_data = eval_res.json()
    
    gaps = eval_data.get('development_gaps', [])
    print(f"Development gaps found: {len(gaps)}")
    for g in gaps:
        print(f" - Gap: {g['competency']} | source: {g.get('source')} | gap: {g['gap']}%")
        
    print(f"Recommendations found: {len(eval_data.get('recommendations', []))}")
    for c in eval_data.get('recommendations', []):
        print(f" - [{c.get('source', 'unknown')}] {c.get('title', 'unknown')} (Matched: {c.get('matched_competency', 'unknown')})")
        
    return True


print("Starting tests...")
test_assessment("Test A", "College / University Faculty", None)

print("Waiting for rate limit...")
time.sleep(15)
test_assessment("Test B", "College / University Faculty", "Artificial Intelligence")

print("Waiting for rate limit...")
time.sleep(15)
test_assessment("Test C", "College / University Faculty", "Data Science")

print("Waiting for rate limit...")
time.sleep(15)
test_assessment("Test D", "College / University Faculty", "Software Development")

print("Waiting for rate limit...")
time.sleep(2)
test_assessment("Test E", "Statistical Officer", None)

