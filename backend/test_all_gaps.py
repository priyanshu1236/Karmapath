import sys
from pathlib import Path
import importlib.util

AI_DIR = Path(__file__).resolve().parent.parent / "ai" / "initial assisment"
spec = importlib.util.spec_from_file_location("baseline_match", str(AI_DIR / "app" / "recommender" / "baseline_match.py"))
baseline_match = importlib.util.module_from_spec(spec)
sys.modules["baseline_match"] = baseline_match
spec.loader.exec_module(baseline_match)

gaps_to_test = [
    {'competency': 'GIS', 'capability': 0.0, 'required': 80, 'gap': 80.0, 'status': 'HIGH PRIORITY', 'source': 'role'},
    {'competency': 'Sampling', 'capability': 33.0, 'required': 80, 'gap': 47.0, 'status': 'PRIORITY', 'source': 'role'},
    {'competency': 'Data Quality', 'capability': 55.0, 'required': 80, 'gap': 25.0, 'status': 'PRIORITY', 'source': 'role'},
    {'competency': 'Python / Data Analysis', 'capability': 0.0, 'required': 80, 'gap': 80.0, 'status': 'HIGH PRIORITY', 'source': 'role'},
    {'competency': 'Agricultural Statistics', 'capability': 40.0, 'required': 80, 'gap': 40.0, 'status': 'PRIORITY', 'source': 'role'},
    {'competency': 'Data Analysis & Visualization', 'capability': 0.0, 'required': 80, 'gap': 80.0, 'status': 'HIGH PRIORITY', 'source': 'area_of_interest'},
]

print("=== TEST ALL GAPS ===")
for g in gaps_to_test:
    res = baseline_match.get_recommendations("Statistical Officer", [g], top_k=1)
    if res:
        c = res[0]
        print(f"\n[Competency: {g['competency']} | Source: {g['source']}]")
        print(f"Course: {c['title']} (Score: {c['score']:.2f})")
        print(f"Reason: {c['reason']}")
    else:
        print(f"\n[Competency: {g['competency']} | Source: {g['source']}] -> No recommendations")

