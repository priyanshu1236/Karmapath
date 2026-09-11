import requests
import json

payload = {
    "role": "Statistical Officer",
    "top_k": 5,
    "development_gaps": [
        {'competency': 'Sampling', 'capability': 33.0, 'required': 80, 'gap': 47.0, 'status': 'PRIORITY', 'source': 'role'},
        {'competency': 'Data Quality', 'capability': 55.0, 'required': 80, 'gap': 25.0, 'status': 'PRIORITY', 'source': 'role'},
        {'competency': 'Software Development', 'capability': 0.0, 'required': 80, 'gap': 80.0, 'status': 'HIGH PRIORITY', 'source': 'area_of_interest'},
    ]
}

res = requests.post("http://localhost:8000/api/recommendations", json=payload)
recs = res.json().get("recommendations", [])
print("=== TEST HIJACK ===")
for c in recs:
    print(f"Course: {c['title']} | Matched: {c['matched_competency']} | Score: {c['score']:.2f} | Reason: {c['reason']}")
