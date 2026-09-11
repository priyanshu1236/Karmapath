import sys
from pathlib import Path
import importlib.util
import json

AI_DIR = Path(__file__).resolve().parent / "ai" / "initial assisment"
spec = importlib.util.spec_from_file_location("baseline_match", str(AI_DIR / "app" / "recommender" / "baseline_match.py"))
baseline_match = importlib.util.module_from_spec(spec)
sys.modules["baseline_match"] = baseline_match
spec.loader.exec_module(baseline_match)

gaps = [{'competency': 'GIS', 'capability': 0.0, 'required': 80, 'gap': 80.0, 'status': 'HIGH PRIORITY'}]

res = baseline_match.get_recommendations("Statistical Officer", gaps, top_k=5)
print(json.dumps(res, indent=2))
