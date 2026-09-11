import sys
from pathlib import Path
import importlib.util

AI_DIR = Path(__file__).resolve().parent.parent / "ai" / "initial assisment"
spec = importlib.util.spec_from_file_location("baseline_match", str(AI_DIR / "app" / "recommender" / "baseline_match.py"))
bm = importlib.util.module_from_spec(spec)
sys.modules["baseline_match"] = bm
spec.loader.exec_module(bm)

print("Data Analysis sim against course_072:")
print(bm.score_semantic("Data Analysis and Decision Making -- I", "course_072", "Data Analysis", "Statistical Officer", ["Data analysis", "statistics"], "Data Analysis and Decision Making is a course..."))
