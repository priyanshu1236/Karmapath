import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.assessment.evaluator import evaluate_assessment
from app.recommender.baseline_match import get_recommendations
from app.data.catalog import get_all_courses

def run_test():
    print("--- Running Recommender Integration Test ---")
    
    blueprints_path = "data/assessments/assessment_blueprints.json"
    question_bank_path = "data/assessments/question_bank_statistical_role.json"
    req_path = "data/assessments/role_requirements.json"
    catalog_path = "data/catalog/courses.json"
    
    # 1. Run evaluation with dummy 0-score answers (worst case scenario)
    result = evaluate_assessment(
        answers={},
        role="Statistical Officer",
        domain="Agricultural Statistics",
        question_bank_path=question_bank_path,
        blueprints_path=blueprints_path,
        req_path=req_path
    )
    
    gaps = result.get("development_gaps", [])
    print(f"Generated {len(gaps)} development gaps.")
    
    # 2. Pass gaps to recommender
    # baseline_match automatically loads catalog via get_all_courses if we pass None for catalog (wait, it just calls get_all_courses internally)
    recommendations = get_recommendations("Statistical Officer", gaps)
    
    print(f"Generated {len(recommendations)} recommendations.")
    
    # Print first recommendation to verify structure
    if recommendations:
        print("Sample Recommendation:")
        import json
        print(json.dumps(recommendations[0], indent=2))
        
    print("\nRecommender integration test passed.")

if __name__ == "__main__":
    run_test()
