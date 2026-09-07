import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from ai.app.data.catalog import get_all_roles, get_all_courses, get_courses_for_role

def inspect_catalog():
    roles = get_all_roles()
    courses = get_all_courses()
    
    print(f"Total roles: {len(roles)}")
    print(f"Total unique courses: {len(courses)}")
    
    mapping_count = 0
    for r in roles:
        mapping_count += len(get_courses_for_role(r.get("title", "")))
        
    print(f"Total role-course links: {mapping_count}")
    
    print("\nFirst 5 roles:")
    for r in roles[:5]:
        print(f" - {r.get('title')} (ID: {r.get('role_id')})")
        
    print("\nFirst 5 courses:")
    for c in courses[:5]:
        metadata_source = c.get('metadata_source', 'N/A')
        print(f" - {c.get('title')} (Source: {metadata_source})")
        
    if roles:
        test_role = roles[0].get("title")
        role_courses = get_courses_for_role(test_role)
        print(f"\nNumber of courses for role '{test_role}': {len(role_courses)}")

if __name__ == "__main__":
    inspect_catalog()
