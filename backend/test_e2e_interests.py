import requests
import json

BASE_URL = "http://localhost:8000/api/assessment"

def run_test(test_name, role, interest=None):
    print(f"\n=========================================")
    print(f"=== {test_name.upper()} ===")
    print(f"=========================================")
    print(f"Role: {role}")
    print(f"Area of interest: {interest or 'None'}")
    
    # 1. Generate Questions
    url = f"{BASE_URL}/generate?role={role}&domain=Agricultural%20Statistics&employee_id=EMP001"
    if interest:
        url += f"&area_of_interest={interest}"
    
    res = requests.get(url)
    if res.status_code != 200:
        print("Failed to generate:", res.text)
        return
        
    data = res.json()
    questions = data['questions']
    
    std_count = len([q for q in questions if not str(q['id']).startswith('AI-GEN')])
    int_count = len([q for q in questions if str(q['id']).startswith('AI-GEN')])
    
    print(f"\n[Questions Generated] Standard: {std_count}, Interest: {int_count}")
    
    # 2. Answer all incorrectly to maximize gap (except interest if we want to simulate cap)
    # Actually, we want to maximize gaps to see recommendations.
    answers = {}
    for q in questions:
        # Just answer "A", likely incorrect for most, which is fine
        answers[q['id']] = "A" 
        
    # 3. Evaluate
    payload = {
        "employee_id": "EMP001",
        "assessment_id": data['assessment_id'],
        "answers": answers,
        "role": role,
        "domain": "Agricultural Statistics",
        "area_of_interest": interest
    }
    
    eval_res = requests.post(f"{BASE_URL}/evaluate", json=payload)
    if eval_res.status_code != 200:
        print("Failed to evaluate:", eval_res.text)
        return
        
    eval_data = eval_res.json()
    
    gaps = eval_data.get('development_gaps', [])
    print(f"\n[Combined Gaps]")
    role_gaps = [g for g in gaps if g.get('source', 'role') != 'area_of_interest']
    int_gaps = [g for g in gaps if g.get('source') == 'area_of_interest']
    
    print("Role Gaps:")
    for g in role_gaps:
        print(f"  - {g['competency']} (Gap: {g['gap']}%)")
        
    if interest:
        print("\nInterest Gaps:")
        for g in int_gaps:
            print(f"  - {g['competency']} (Gap: {g['gap']}%)")
            
    recs = eval_data.get('recommendations', [])
    print(f"\n[Courses returned]: {len(recs)}")
    for c in recs:
        # Look up what gap this course corresponds to
        source_matched = "role_gap"
        for g in int_gaps:
            if g['competency'] == c['matched_competency']:
                source_matched = "area_of_interest"
                break
                
        print(f"\nTitle: {c['title']}")
        print(f"Matched Competency: {c['matched_competency']}")
        print(f"Recommendation Source: {source_matched}")
        print(f"Reason: {c['reason']}")

print("Starting E2E Tests...")
# Test A
run_test("Test A - Role Only", "Statistical Officer")
# Test B
run_test("Test B - Role + Data Analysis", "Statistical Officer", "Data Analysis")
# Test C
run_test("Test C - Role + Cybersecurity", "Statistical Officer", "Cybersecurity")
# Test D
run_test("Test D - Career Switch", "Statistical Officer", "Software Development")
