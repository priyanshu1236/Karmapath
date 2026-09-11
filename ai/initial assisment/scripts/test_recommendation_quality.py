import sys
import json
from pathlib import Path

# Add the ai package to sys.path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.recommender.baseline_match import get_recommendations

def run_test():
    role = "Statistical Officer"
    
    # 6 Target competencies as per user prompt
    gaps = [
        {"competency": "Sampling", "capability": 50.0, "required": 80.0, "gap": 30.0, "status": "PRIORITY"},
        {"competency": "Survey Design", "capability": 60.0, "required": 80.0, "gap": 20.0, "status": "PRIORITY"},
        {"competency": "Data Quality", "capability": 40.0, "required": 80.0, "gap": 40.0, "status": "PRIORITY"},
        {"competency": "GIS", "capability": 70.0, "required": 80.0, "gap": 10.0, "status": "PRIORITY"},
        {"competency": "Agricultural Statistics", "capability": 20.0, "required": 80.0, "gap": 60.0, "status": "PRIORITY"},
        {"competency": "Python / Data Analysis", "capability": 30.0, "required": 80.0, "gap": 50.0, "status": "PRIORITY"}
    ]
    
    print(f"=== RECOMMENDATION QUALITY TEST ({role}) ===\n")
    
    for gap in gaps:
        print(f"--- GAP: {gap['competency']} (Gap size: {gap['gap']}%) ---")
        recs = get_recommendations(role, [gap], top_k=5)
        
        for i, r in enumerate(recs, 1):
            title = r.get('title', 'Unknown')
            cid = r.get('course_id', 'N/A')
            score = r.get('score', 0)
            sem = r.get('semantic_score', 0)
            role_b = r.get('role_bonus', 0)
            gap_p = r.get('gap_priority_score', 0)
            reason = r.get('reason', '')
            
            print(f"{i}. [{cid}] {title}")
            print(f"   Score: {score:.4f} (Semantic: {sem:.4f}, Role Bonus: {role_b:.4f}, Gap Priority: {gap_p:.4f})")
            print(f"   Reason: {reason}")
        print("\n")

if __name__ == "__main__":
    run_test()
