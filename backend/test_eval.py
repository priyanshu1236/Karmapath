import requests

# 1. Generate questions
res = requests.get("http://localhost:8000/api/assessment/generate?role=Statistical%20Officer&domain=Agricultural%20Statistics&employee_id=EMP001&area_of_interest=Cybersecurity")
data = res.json()
q_ids = [q['id'] for q in data['questions']]

print("Generated IDs:", q_ids)

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
    "area_of_interest": "Cybersecurity"
}

eval_res = requests.post("http://localhost:8000/api/assessment/evaluate", json=payload)
eval_data = eval_res.json()

print("\n--- EVALUATION RESULT ---")
print("Role gaps:", len(eval_data.get('role_gaps', [])))
print("Interest gaps:", len(eval_data.get('development_gaps', [])))
if 'interest_assessment' in eval_data:
    print("Interest Assessment:", eval_data['interest_assessment'])
else:
    print("Missing interest_assessment!")

