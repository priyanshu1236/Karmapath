import requests

# 1. Generate questions
res = requests.get("http://localhost:8000/api/assessment/generate?role=Statistical%20Officer&domain=Agricultural%20Statistics&employee_id=EMP001&area_of_interest=Artificial%20Intelligence")
data = res.json()
q_ids = [q['id'] for q in data['questions']]

# 2. Prepare answers
answers = {}
for q in data['questions']:
    answers[q['id']] = "A"

# 3. Submit evaluation
payload = {
    "employee_id": "EMP001",
    "assessment_id": data['assessment_id'],
    "answers": answers,
    "role": "Statistical Officer",
    "domain": "Agricultural Statistics",
    "area_of_interest": "Artificial Intelligence"
}

eval_res = requests.post("http://localhost:8000/api/assessment/evaluate", json=payload)
eval_data = eval_res.json()

print("\n=== ACTUAL API RESPONSE ===")
print("development_gaps count:", len(eval_data.get('development_gaps', [])))
print("recommendations count:", len(eval_data.get('recommendations', [])))
print("development_gaps:", eval_data.get('development_gaps', []))
