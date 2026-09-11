import requests
import json

BASE_URL = "http://localhost:8000/api/assessment"

def run_test():
    role = "Statistical Officer"
    interest = "Data Analysis"
    
    params = {
        "role": role,
        "domain": "Agricultural Statistics",
        "employee_id": "EMP001",
        "area_of_interest": interest
    }
    res = requests.get(f"{BASE_URL}/generate", params=params)
    data = res.json()
    questions = data['questions']
    
    answers = {}
    for i, q in enumerate(questions):
        if str(q['id']).startswith('AI-GEN'):
            answers[q['id']] = "C" # Deliberately wrong so gap is 100%
        else:
            answers[q['id']] = "A" if i % 2 == 0 else "C"
            
    payload = {
        "employee_id": "EMP001",
        "assessment_id": data['assessment_id'],
        "answers": answers,
        "role": role,
        "domain": "Agricultural Statistics",
        "area_of_interest": interest
    }
    
    eval_res = requests.post(f"{BASE_URL}/evaluate", json=payload)
    if eval_res.status_code != 200:
        print("Failed:", eval_res.text)
        return
        
    eval_data = eval_res.json()
    
    gaps = eval_data.get('development_gaps', [])
    for g in gaps:
        print(f"Gap: {g['competency']} | source: {g.get('source')} | gap: {g['gap']}%")
        
    print("\nRecommendations:")
    for c in eval_data.get('recommendations', []):
        print(f"[{c['source']}] {c['title']} (Matched: {c['matched_competency']}) - Score: {c['score']}")

run_test()
