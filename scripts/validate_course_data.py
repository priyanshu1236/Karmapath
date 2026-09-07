import json
from pathlib import Path
import sys

DATA_DIR = Path(__file__).parent.parent / "data"

def validate_json_file(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f), True
    except Exception as e:
        print(f"Error loading {file_path}: {e}")
        return None, False

def validate_data():
    print("Validating data...")
    roles_file = DATA_DIR / "roles" / "roles.json"
    courses_file = DATA_DIR / "courses" / "courses.json"
    mapping_file = DATA_DIR / "courses" / "role_course_mapping.json"
    
    roles_data, r_ok = validate_json_file(roles_file)
    courses_data, c_ok = validate_json_file(courses_file)
    mapping_data, m_ok = validate_json_file(mapping_file)
    
    if not (r_ok and c_ok and m_ok):
        print("Failed to load JSON files.")
        return
        
    roles = roles_data.get("roles", [])
    courses = courses_data.get("courses", [])
    mapping = mapping_data.get("mapping", {})
    
    print(f"Loaded {len(roles)} roles, {len(courses)} courses.")
    
    # Check duplicate role IDs
    role_ids = set()
    role_titles = set()
    for r in roles:
        rid = r.get("role_id")
        title = r.get("title")
        if rid in role_ids:
            print(f"Warning: Duplicate role ID {rid}")
        role_ids.add(rid)
        
        if not title:
            print(f"Warning: Role with ID {rid} has no title")
        else:
            role_titles.add(title)
            
    # Check duplicate course IDs
    course_ids = set()
    for c in courses:
        cid = c.get("course_id")
        if cid in course_ids:
            print(f"Warning: Duplicate course ID {cid}")
        course_ids.add(cid)
        if not c.get("title"):
            print(f"Warning: Course with ID {cid} has no title")
            
    # Check mapping
    for rid, cids in mapping.items():
        if rid not in role_ids:
            print(f"Warning: Mapping references non-existent role ID {rid}")
        for cid in cids:
            if cid not in course_ids:
                print(f"Warning: Mapping references non-existent course ID {cid} for role {rid}")
                
    # Check Statistical Officer
    if "Statistical Officer" not in role_titles:
        print("CRITICAL WARNING: 'Statistical Officer' role does NOT exist in imported 40-role dataset.")
    else:
        print("Success: 'Statistical Officer' exists in the dataset.")
        
    print("Validation complete.")

if __name__ == "__main__":
    validate_data()
