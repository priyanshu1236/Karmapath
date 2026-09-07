import pytest
import os
import json
from app.assessment.evaluator import evaluate_assessment, _classify_severity, _classify_gap_status

QBANK_PATH = "data/assessments/question_bank_statistical_role.json"
BLUEPRINTS_PATH = "data/assessments/assessment_blueprints.json"
REQ_PATH = "data/assessments/role_requirements.json"

@pytest.fixture(scope="module")
def qbank():
    with open(QBANK_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)

@pytest.fixture(scope="module")
def blueprints():
    with open(BLUEPRINTS_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)

def test_statistical_officer_blueprint_18_questions(blueprints):
    bp = blueprints["initial_assessment"]["statistical_officer"]
    assert bp["question_count"] == 18

def test_exactly_3_questions_per_competency(blueprints):
    bp = blueprints["initial_assessment"]["statistical_officer"]
    for comp, qids in bp["competencies"].items():
        assert len(qids) == 3, f"Competency {comp} has {len(qids)} questions, expected 3"

def test_no_duplicate_question_ids(blueprints):
    bp = blueprints["initial_assessment"]["statistical_officer"]
    all_qids = []
    for qids in bp["competencies"].values():
        all_qids.extend(qids)
    assert len(all_qids) == len(set(all_qids)), "Duplicate question IDs found in blueprint"

def test_every_blueprint_question_exists_and_matches_competency(blueprints, qbank):
    bp = blueprints["initial_assessment"]["statistical_officer"]
    qbank_dict = {q["id"]: q for q in qbank}
    
    for comp, qids in bp["competencies"].items():
        for qid in qids:
            assert qid in qbank_dict, f"Question {qid} not found in question bank"
            # Evaluate against competency_id or fallback to competency
            actual_comp = qbank_dict[qid].get("competency_id", qbank_dict[qid].get("competency"))
            assert actual_comp == comp, f"Question {qid} competency mismatch"

def test_evaluation_returns_six_assessed_competencies_and_no_overall(blueprints, qbank):
    # Construct a valid all-correct answer payload
    bp = blueprints["initial_assessment"]["statistical_officer"]
    answers = {}
    qbank_dict = {q["id"]: q for q in qbank}
    
    for comp, qids in bp["competencies"].items():
        for qid in qids:
            answers[qid] = qbank_dict[qid]["correct_answer"]
            
    result = evaluate_assessment(
        answers, 
        role="Statistical Officer", 
        domain="Agricultural Statistics", 
        question_bank_path=QBANK_PATH,
        blueprints_path=BLUEPRINTS_PATH,
        req_path=REQ_PATH
    )
    
    # 10. No overall competency exists
    assert "summary" not in result or "overall_score" not in result.get("summary", {})
    assert "overall_competency" not in result
    
    # 9. Evaluation returns only the six assessed competencies
    assert len(result["role_capability_profile"]) == 6
    assert len(result["development_gaps"]) == 6
    
    # 11. Gap calculation is correct (100% capability vs 80% req -> 0 gap)
    for gap_info in result["development_gaps"]:
        assert gap_info["capability"] == 100.0
        assert gap_info["gap"] == 0.0
        assert gap_info["status"] == "COMPETENT"
        
    # 12. Highest priority gap is correct (None if all 100%)
    assert result["highest_priority_gap"] is None

def test_unsupported_role_gracefully_fails():
    with pytest.raises(ValueError, match="No blueprint found"):
        evaluate_assessment(
            {}, 
            role="Unknown Role", 
            domain="Unknown Domain", 
            question_bank_path=QBANK_PATH,
            blueprints_path=BLUEPRINTS_PATH,
            req_path=REQ_PATH
        )

def test_gap_calculation_and_highest_priority():
    # Submit 0 answers, capability is 0
    result = evaluate_assessment(
        {}, 
        role="Statistical Officer", 
        domain="Agricultural Statistics", 
        question_bank_path=QBANK_PATH,
        blueprints_path=BLUEPRINTS_PATH,
        req_path=REQ_PATH
    )
    
    assert len(result["development_gaps"]) == 6
    for gap_info in result["development_gaps"]:
        assert gap_info["capability"] == 0.0
        # Required is 80, gap is 80
        assert gap_info["gap"] == 80.0
        assert gap_info["status"] == "HIGH PRIORITY"
        
    assert result["highest_priority_gap"] is not None
    assert result["highest_priority_gap"]["gap"] == 80.0

def test_scoring_fractional_capability_for_3_questions(blueprints, qbank):
    bp = blueprints["initial_assessment"]["statistical_officer"]
    qbank_dict = {q["id"]: q for q in qbank}
    
    answers = {}
    
    # Let's provide answers for 'COMP-AGRICULTURAL-STATISTICS' explicitly
    comp_qids = bp["competencies"]["COMP-AGRICULTURAL-STATISTICS"]
    
    # 1/3 correct
    answers = {comp_qids[0]: qbank_dict[comp_qids[0]]["correct_answer"]}
    res1 = evaluate_assessment(answers, "Statistical Officer", "Agricultural Statistics", QBANK_PATH, BLUEPRINTS_PATH, REQ_PATH)
    cap1 = next(c["capability"] for c in res1["role_capability_profile"] if c["competency"] == "Agricultural Statistics")
    assert cap1 == 33.33
    gap1 = next(g["gap"] for g in res1["development_gaps"] if g["competency"] == "Agricultural Statistics")
    assert gap1 == 46.67
    
    # 2/3 correct
    answers[comp_qids[1]] = qbank_dict[comp_qids[1]]["correct_answer"]
    res2 = evaluate_assessment(answers, "Statistical Officer", "Agricultural Statistics", QBANK_PATH, BLUEPRINTS_PATH, REQ_PATH)
    cap2 = next(c["capability"] for c in res2["role_capability_profile"] if c["competency"] == "Agricultural Statistics")
    assert cap2 == 66.67
    gap2 = next(g["gap"] for g in res2["development_gaps"] if g["competency"] == "Agricultural Statistics")
    assert gap2 == 13.33

def test_status_boundaries():
    assert _classify_gap_status(0) == "COMPETENT"
    assert _classify_gap_status(10) == "DEVELOPING"
    assert _classify_gap_status(10.01) == "PRIORITY"
    assert _classify_gap_status(25) == "PRIORITY"
    assert _classify_gap_status(25.01) == "HIGH PRIORITY"

def test_empty_and_incomplete_answers(blueprints, qbank):
    # Missing answers gracefully ignored, which awards 0 marks.
    res_empty = evaluate_assessment({}, "Statistical Officer", "Agricultural Statistics", QBANK_PATH, BLUEPRINTS_PATH, REQ_PATH)
    for cap in res_empty["role_capability_profile"]:
        assert cap["capability"] == 0.0
    
    # Submit exactly 1 valid answer, ensure the rest remain 0
    bp = blueprints["initial_assessment"]["statistical_officer"]
    qbank_dict = {q["id"]: q for q in qbank}
    first_qid = bp["competencies"]["COMP-SURVEY-DESIGN"][0]
    answers = {first_qid: qbank_dict[first_qid]["correct_answer"]}
    
    res_inc = evaluate_assessment(answers, "Statistical Officer", "Agricultural Statistics", QBANK_PATH, BLUEPRINTS_PATH, REQ_PATH)
    sd_cap = next(c["capability"] for c in res_inc["role_capability_profile"] if c["competency"] == "Survey Design")
    assert sd_cap == 33.33
    
    as_cap = next(c["capability"] for c in res_inc["role_capability_profile"] if c["competency"] == "Agricultural Statistics")
    assert as_cap == 0.0

def test_invalid_inputs_rejected(blueprints, qbank):
    bp = blueprints["initial_assessment"]["statistical_officer"]
    qbank_dict = {q["id"]: q for q in qbank}
    first_qid = bp["competencies"]["COMP-SURVEY-DESIGN"][0]
    
    # 1. Invalid option (e.g. 'Z')
    with pytest.raises(ValueError, match="Invalid answer value 'Z'"):
        evaluate_assessment({first_qid: "Z"}, "Statistical Officer", "Agricultural Statistics", QBANK_PATH, BLUEPRINTS_PATH, REQ_PATH)
        
    # 2. Extra/unknown question ID
    with pytest.raises(ValueError, match="Invalid question ID provided"):
        evaluate_assessment({"UNKNOWN-ID": "A"}, "Statistical Officer", "Agricultural Statistics", QBANK_PATH, BLUEPRINTS_PATH, REQ_PATH)

