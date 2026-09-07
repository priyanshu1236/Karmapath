import json
import os
from typing import Dict, Any, List
from pathlib import Path

DEFAULT_DATA_DIR = Path(__file__).parent.parent.parent / "data"

# Thresholds for skill gap classification
# These are prototype thresholds, not scientifically validated thresholds.
# (0-49.99 = HIGH, 50-69.99 = MEDIUM, 70-100 = LOW)
THRESHOLD_HIGH_UPPER = 49.99
THRESHOLD_MEDIUM_UPPER = 69.99

def _classify_severity(score_percentage: float) -> str:
    """Classifies severity based on prototype thresholds."""
    if score_percentage <= THRESHOLD_HIGH_UPPER:
        return "HIGH"
    elif score_percentage <= THRESHOLD_MEDIUM_UPPER:
        return "MEDIUM"
    else:
        return "LOW"

def _classify_gap_status(gap: float) -> str:
    if gap == 0:
        return "COMPETENT"
    elif gap <= 10:
        return "DEVELOPING"
    elif gap <= 25:
        return "PRIORITY"
    else:
        return "HIGH PRIORITY"

def _load_question_bank(path: str) -> List[Dict[str, Any]]:
    if not os.path.exists(path):
        raise FileNotFoundError(f"Question bank not found at path: {path}")
    
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def evaluate_assessment(
    answers: Dict[str, str], 
    role: str,
    domain: str,
    question_bank_path: str = None,
    blueprints_path: str = None,
    req_path: str = None
) -> Dict[str, Any]:
    """
    Evaluates assessment answers strictly against the blueprint for the given role.
    """
    if question_bank_path is None:
        question_bank_path = str(DEFAULT_DATA_DIR / "assessments" / "question_bank_statistical_role.json")
    if blueprints_path is None:
        blueprints_path = str(DEFAULT_DATA_DIR / "assessments" / "assessment_blueprints.json")
    if req_path is None:
        req_path = str(DEFAULT_DATA_DIR / "assessments" / "role_requirements.json")

    qbank = _load_question_bank(question_bank_path)
    
    with open(blueprints_path, "r", encoding="utf-8") as f:
        blueprints = json.load(f)
        
    role_id = role.lower().replace(" ", "_")
    blueprint = blueprints.get("initial_assessment", {}).get(role_id)
    if not blueprint:
        raise ValueError(f"No blueprint found for role: {role}")
        
    target_competencies = blueprint.get("competencies", {})
    expected_qids = set()
    for comp, q_ids in target_competencies.items():
        expected_qids.update(q_ids)
        
    qbank_dict = {q['id']: q for q in qbank if q['id'] in expected_qids}
    
    # VALIDATION: Blueprint strictness
    expected_question_count = blueprint.get("question_count", len(expected_qids))
    
    for comp, q_ids in target_competencies.items():
        for qid in q_ids:
            if qid not in qbank_dict:
                raise ValueError(f"Blueprint question ID '{qid}' not found in question bank")
            # For backwards compatibility, check competency_id if it exists, otherwise fall back to string competency
            q_comp_id = qbank_dict[qid].get('competency_id', qbank_dict[qid].get('competency'))
            if q_comp_id != comp:
                raise ValueError(f"Question '{qid}' competency_id '{q_comp_id}' does not match blueprint competency '{comp}'")
            if 'question_text' not in qbank_dict[qid]:
                raise ValueError(f"Question '{qid}' is missing required field 'question_text'")

    if len(expected_qids) != expected_question_count:
        raise ValueError(f"Blueprint must contain exactly {expected_question_count} unique questions, found {len(expected_qids)}")
    
    # VALIDATION: Check if all submitted answer IDs belong to the blueprint
    for qid in answers.keys():
        if qid not in expected_qids:
            raise ValueError(f"Invalid question ID provided in answers: '{qid}' is not part of this assessment")
            
    # VALIDATION: Check if submitted answer values are valid options
    for qid, ans in answers.items():
        valid_options = qbank_dict[qid].get('options', {})
        if ans not in valid_options:
            raise ValueError(f"Invalid answer value '{ans}' for question ID '{qid}'")
            
    try:
        with open(req_path, 'r', encoding='utf-8') as f:
            reqs = json.load(f)
            role_reqs = reqs.get(role, {})
    except Exception:
        role_reqs = {}
            
    # Trackers for competencies
    competency_tracker = {
        comp: {
            'total_questions': 0, 'answered_questions': 0, 'correct_answers': 0, 
            'total_marks': 0.0, 'obtained_marks': 0.0, 'competency_name': comp
        } for comp in target_competencies.keys()
    }
    
    for qid, q in qbank_dict.items():
        comp = q.get('competency_id', q.get('competency'))
        if comp not in competency_tracker:
            continue
            
        # Store human-readable name for output
        if 'competency' in q:
            competency_tracker[comp]['competency_name'] = q['competency']
            
        marks = float(q.get('marks', 1.0))
        
        competency_tracker[comp]['total_questions'] += 1
        competency_tracker[comp]['total_marks'] += marks
        
        # Note: Missing answers are gracefully ignored here, effectively yielding 0 obtained marks.
        if qid in answers:
            ans = answers[qid]
            is_correct = (ans == q['correct_answer'])
            
            competency_tracker[comp]['answered_questions'] += 1
            
            if is_correct:
                competency_tracker[comp]['correct_answers'] += 1
                competency_tracker[comp]['obtained_marks'] += marks
                
    role_capability_profile = []
    development_gaps = []
    highest_priority_gap = None
    max_gap = -1
    
    for comp, data in competency_tracker.items():
        if data['total_questions'] > 0:
            comp_name = data['competency_name']
            capability = round((data['obtained_marks'] / data['total_marks'] * 100), 2) if data['total_marks'] > 0 else 0.0
            
            # Lookup required score. We check the role requirements dict.
            # If not specified, we fallback to 80 (since Statistical Officer has 80 hardcoded).
            required = role_reqs.get(comp_name, role_reqs.get(comp, 80))
            gap = round(max(0.0, required - capability), 2)
            
            role_capability_profile.append({
                "competency": comp_name,
                "capability": capability,
                "required": required,
                "question_count": data['total_questions']
            })
            
            status = _classify_gap_status(gap)
            development_gaps.append({
                "competency": comp_name,
                "capability": capability,
                "required": required,
                "gap": gap,
                "status": status
            })
            
            if gap > max_gap:
                max_gap = gap
                highest_priority_gap = {
                    "competency": comp_name,
                    "gap": gap
                }
                
    # Sort gaps by gap descending
    development_gaps.sort(key=lambda x: x["gap"], reverse=True)
    
    if max_gap <= 0:
        highest_priority_gap = None

    return {
        "role": role,
        "domain": domain,
        "assessment": {
            "type": "Initial Assessment",
            "version": blueprint.get("version", "v1"),
            "question_count": blueprint.get("question_count", 12)
        },
        "role_capability_profile": role_capability_profile,
        "development_gaps": development_gaps,
        "highest_priority_gap": highest_priority_gap
    }
