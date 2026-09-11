import requests
import json
import time

BASE_URL = "http://localhost:8000/api/assessment"

def run_tests():
    print("--- Running Tests ---")
    
    # Test 1: Existing Statistical Officer without interest
    print("\nTest 1: Existing Statistical Officer")
    res = requests.get(f"{BASE_URL}/generate?role=Statistical Officer&domain=Agricultural Statistics&employee_id=EMP_T1")
    data = res.json()
    if len(data.get("questions", [])) == 18 and data.get("area_of_interest") is None:
        print("PASS: Existing functionality works")
    else:
        print(f"FAIL: Expected 18 questions, got {len(data.get('questions', []))}")
        
    # Test 2: With area of interest (LLM should fail here because no API key)
    print("\nTest 2 & 6: Area of Interest with LLM Failure")
    res = requests.get(f"{BASE_URL}/generate?role=Statistical Officer&domain=Agricultural Statistics&employee_id=EMP_T2&area_of_interest=Technology")
    data = res.json()
    if len(data.get("questions", [])) == 18 and data.get("area_of_interest") == "Technology":
        print("PASS: Fallback to regular question bank on LLM failure works")
    else:
        print(f"FAIL: Expected 18 questions, got {len(data.get('questions', []))}")
        
    # Test Evaluate on existing
    print("\nTest 7 & 8: Evaluation & Recommendations on Existing")
    eval_payload = {
        "employee_id": "EMP_T1",
        "assessment_id": "ASSESS-001",
        "role": "Statistical Officer",
        "domain": "Agricultural Statistics",
        "answers": {q["id"]: "A" for q in data.get("questions", [])}
    }
    res_eval = requests.post(f"{BASE_URL}/evaluate", json=eval_payload)
    eval_data = res_eval.json()
    if "role_capability_profile" in eval_data and "development_gaps" in eval_data and "recommendations" in eval_data:
        print("PASS: Evaluation and recommendations generated successfully")
    else:
        print("FAIL: Missing expected fields in evaluation response")
        
    print("\nEnd of automated backend tests.")

if __name__ == "__main__":
    run_tests()
