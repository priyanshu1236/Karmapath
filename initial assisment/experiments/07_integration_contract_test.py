import sys
import json
import os

# Add 'app' directory to path if needed for relative imports
sys.path.append(os.path.abspath(os.path.dirname(__file__) + "/.."))

try:
    from app.assessment.evaluator import evaluate_assessment
    from app.recommender.baseline_match import get_recommendations
except ImportError as e:
    print(f"Failed to import: {e}")
    sys.exit(1)

def simulate_integration():
    print("--- Simulating SIH Integration Contract ---")
    
    # 1. Mock Employee Profile & Answers Submission
    role_id = "statistical_officer"
    answers = {
        "STAT-AS-001": "B",
        "STAT-AS-002": "B",
        "STAT-AS-003": "A", # Maybe wrong
        "STAT-SD-001": "B",
        "STAT-SD-002": "B",
        "STAT-SD-003": "B",
        "STAT-SAM-001": "B",
        "STAT-SAM-002": "B",
        "STAT-SAM-003": "B",
        "STAT-DQ-001": "C",
        "STAT-DQ-002": "B",
        "STAT-DQ-003": "C",
        "TECH-GIS-001": "B",
        "TECH-GIS-002": "B",
        "TECH-GIS-003": "B",
        "TECH-PY-001": "A",
        "TECH-DV-001": "B",
        "TECH-PY-002": "D"
    }
    
    # 2. Call Evaluator
    try:
        assessment_result = evaluate_assessment(
            answers=answers, 
            role=role_id, 
            domain="Statistical"
        )
    except Exception as e:
        print(f"Evaluator crashed: {e}")
        return
        
    gaps = assessment_result.get("development_gaps", {})
    print(f"Calculated Gaps: {gaps}")
    
    # 3. Call Recommender
    try:
        recommendations = get_recommendations(role_id, gaps, top_k=5)
    except Exception as e:
        print(f"Recommender crashed: {e}")
        return
        
    final_payload = {
        "employee_role": role_id,
        "assessment_result": assessment_result,
        "course_recommendations": recommendations
    }
    
    # 4. JSON Serialization check
    try:
        json_str = json.dumps(final_payload, indent=2)
        print("Serialization: SUCCESS")
    except TypeError as e:
        print(f"Serialization FAILED: {e}")
        return
        
    with open("experiments/07_full_e2e_output.json", "w") as f:
        f.write(json_str)
        
    print("Integration E2E complete. Output saved to 07_full_e2e_output.json.")

if __name__ == "__main__":
    simulate_integration()
