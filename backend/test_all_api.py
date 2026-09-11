import requests
import json

gaps = [
    {'competency': 'GIS', 'capability': 0.0, 'required': 80, 'gap': 80.0, 'status': 'HIGH PRIORITY', 'source': 'role'},
    {'competency': 'Sampling', 'capability': 33.0, 'required': 80, 'gap': 47.0, 'status': 'PRIORITY', 'source': 'role'},
    {'competency': 'Data Quality', 'capability': 55.0, 'required': 80, 'gap': 25.0, 'status': 'PRIORITY', 'source': 'role'},
    {'competency': 'Python / Data Analysis', 'capability': 0.0, 'required': 80, 'gap': 80.0, 'status': 'HIGH PRIORITY', 'source': 'role'},
    {'competency': 'Agricultural Statistics', 'capability': 40.0, 'required': 80, 'gap': 40.0, 'status': 'PRIORITY', 'source': 'role'},
    {'competency': 'Data Analysis & Visualization', 'capability': 0.0, 'required': 80, 'gap': 80.0, 'status': 'HIGH PRIORITY', 'source': 'area_of_interest'},
]

for g in gaps:
    payload = {
        "role": "Statistical Officer",
        "top_k": 1,
        "development_gaps": [g]
    }
    res = requests.post("http://localhost:8000/api/recommendations", json=payload)
    recs = res.json().get("recommendations", [])
    if recs:
        print(f"[{g['competency']}] -> {recs[0]['title']}")
        print(f"Reason: {recs[0]['reason']}\n")
    else:
        print(f"[{g['competency']}] -> None\n")
