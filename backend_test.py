import requests
import json

print("--- TESTING /api/assessment/generate ---")
res = requests.get("http://localhost:8000/api/assessment/generate?role=Statistical Officer&domain=Agricultural Statistics&employee_id=EMP001")
data = res.json()
print("Questions received:", len(data.get("questions", [])))
print("Sample Question 0:")
print(json.dumps(data.get("questions", [])[0], indent=2))

print("\n--- TESTING /api/assessment/evaluate ---")
# Build a dummy answer payload
answers = {}
for q in data.get("questions", []):
    answers[q["id"]] = "A"

payload = {
    "employee_id": "EMP001",
    "assessment_id": data["assessment_id"],
    "role": "Statistical Officer",
    "domain": "Agricultural Statistics",
    "answers": answers
}
res2 = requests.post("http://localhost:8000/api/assessment/evaluate", json=payload)
print(json.dumps(res2.json(), indent=2))
