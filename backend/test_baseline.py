import sys
from pathlib import Path
import importlib.util

AI_DIR = Path(__file__).resolve().parent.parent / "ai" / "initial assisment"
spec = importlib.util.spec_from_file_location("baseline_match", str(AI_DIR / "app" / "recommender" / "baseline_match.py"))
baseline_match = importlib.util.module_from_spec(spec)
sys.modules["baseline_match"] = baseline_match
spec.loader.exec_module(baseline_match)

gaps = [{'competency': 'Survey Design', 'capability': 0.0, 'required': 80, 'gap': 80.0, 'status': 'HIGH PRIORITY'}, {'competency': 'Sampling', 'capability': 0.0, 'required': 80, 'gap': 80.0, 'status': 'HIGH PRIORITY'}, {'competency': 'Agricultural Statistics', 'capability': 66.67, 'required': 80, 'gap': 13.33, 'status': 'PRIORITY'}, {'competency': 'Data Quality', 'capability': 66.67, 'required': 80, 'gap': 13.33, 'status': 'PRIORITY'}, {'competency': 'GIS', 'capability': 66.67, 'required': 80, 'gap': 13.33, 'status': 'PRIORITY'}, {'competency': 'Python / Data Analysis', 'capability': 66.67, 'required': 80, 'gap': 13.33, 'status': 'PRIORITY'}, {'competency': 'AI/ML', 'capability': 0.0, 'required': 80, 'gap': 80.0, 'status': 'HIGH PRIORITY', 'source': 'area_of_interest'}, {'competency': 'Python / Data Analysis', 'capability': 0.0, 'required': 80, 'gap': 80.0, 'status': 'HIGH PRIORITY', 'source': 'area_of_interest'}]

res = baseline_match.get_recommendations("Statistical Officer", gaps)
print("recommendations count:", len(res))
if len(res) > 0:
    for i, r in enumerate(res[:3]):
        print(f"Top {i+1}:", r['course_title'])
