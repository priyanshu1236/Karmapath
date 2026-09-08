import json
import sys
from pathlib import Path

# Add the parent directory to sys.path so 'app' can be imported when running from inside or outside 'ai' folder
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.assessment.evaluator import evaluate_assessment

def run_test():
    print("--- Running Deterministic Assessment Evaluator Test ---")
    blueprints_path = "data/assessments/assessment_blueprints.json"
    question_bank_path = "data/assessments/question_bank_statistical_role.json"
    req_path = "data/assessments/role_requirements.json"
    
    with open(blueprints_path, 'r', encoding='utf-8') as f:
        blueprints = json.load(f)
        
    with open(question_bank_path, 'r', encoding='utf-8') as f:
        qbank = json.load(f)
        
    qbank_dict = {q['id']: q for q in qbank}
        
    target_competencies = blueprints["initial_assessment"]["statistical_officer"]["competencies"]
    
    sample_answers = {}
    
    for comp, qids in target_competencies.items():
        for i, qid in enumerate(qids):
            correct_ans = qbank_dict[qid]['correct_answer']
            options = qbank_dict[qid].get('options', {})
            
            if i == 1:
                wrong_ans = next((k for k in options.keys() if k != correct_ans), 'A')
                sample_answers[qid] = wrong_ans
            else:
                sample_answers[qid] = correct_ans
    
    print("\nSubmitted Answers:")
    print(json.dumps(sample_answers, indent=2))
    
    # Evaluate - overriding paths assuming script is run from ai/ folder
    result = evaluate_assessment(
        answers=sample_answers,
        role="Statistical Officer",
        domain="Agricultural Statistics",
        question_bank_path="data/assessments/question_bank_statistical_role.json",
        blueprints_path="data/assessments/assessment_blueprints.json",
        req_path="data/assessments/role_requirements.json"
    )
    
    print("\n--- EVALUATION RESULTS ---")
    
    print("\n[Assessment Info]")
    print(json.dumps(result.get("assessment", {}), indent=2))
    
    print("\n[Role Capability Profile]")
    print(json.dumps(result.get("role_capability_profile", []), indent=2))
    
    print("\n[Identified Development Gaps]")
    print(json.dumps(result.get("development_gaps", []), indent=2))
    
    print("\n[Highest Priority Gap]")
    print(json.dumps(result.get("highest_priority_gap", {}), indent=2))

if __name__ == "__main__":
    run_test()
