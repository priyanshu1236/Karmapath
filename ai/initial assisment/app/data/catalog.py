import json
import os
from pathlib import Path

# Paths to data files
DATA_DIR = Path(__file__).parent.parent.parent / "data"
ROLES_FILE = DATA_DIR / "roles" / "roles.json"
COURSES_FILE = DATA_DIR / "courses" / "courses.json"
MAPPING_FILE = DATA_DIR / "courses" / "role_course_mapping.json"
TOPIC_MAPPING_FILE = DATA_DIR / "courses" / "course_topic_mapping.json"
COMPETENCIES_FILE = DATA_DIR / "competencies" / "competency_registry.json"

_roles_data = None
_courses_data = None
_mapping_data = None
_topic_mapping_data = None
_competencies_data = None

def _load_json(file_path):
    if not file_path.exists():
        raise FileNotFoundError(f"File not found: {file_path}")
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)

def _get_roles():
    global _roles_data
    if _roles_data is None:
        _roles_data = _load_json(ROLES_FILE)
    return _roles_data.get("roles", [])

def _get_courses():
    global _courses_data
    if _courses_data is None:
        _courses_data = _load_json(COURSES_FILE)
    return _courses_data.get("courses", [])

def _get_mapping():
    global _mapping_data
    if _mapping_data is None:
        _mapping_data = _load_json(MAPPING_FILE)
    return _mapping_data.get("mapping", {})

def get_all_roles():
    """Return all roles as a list of dicts."""
    return _get_roles()

def get_all_courses():
    """Return all courses as a list of dicts."""
    return _get_courses()

def get_role(role_name):
    """Get a role by its title."""
    for role in get_all_roles():
        if role.get("title") == role_name:
            return role
    return None

def get_course(course_id):
    """Get a course by its ID."""
    for course in get_all_courses():
        if course.get("course_id") == course_id:
            return course
    return None

def get_courses_for_role(role_name):
    """Get all courses associated with a role."""
    role = get_role(role_name)
    if not role:
        return []
    
    role_id = role.get("role_id")
    mapping = _get_mapping()
    
    # mapping structure is likely a dict of role_id -> list of course_ids
    course_ids = mapping.get(role_id, [])
    
    courses = []
    for cid in course_ids:
        c = get_course(cid)
        if c:
            courses.append(c)
    return courses

def _get_topic_mapping():
    global _topic_mapping_data
    if _topic_mapping_data is None:
        try:
            _topic_mapping_data = _load_json(TOPIC_MAPPING_FILE).get("mappings", [])
        except FileNotFoundError:
            _topic_mapping_data = []
    return _topic_mapping_data

def _get_competencies():
    global _competencies_data
    if _competencies_data is None:
        try:
            _competencies_data = _load_json(COMPETENCIES_FILE).get("competencies", [])
        except FileNotFoundError:
            _competencies_data = []
    return _competencies_data

def get_topics_for_course(course_id):
    """Get topics mapped to a course ID."""
    mappings = _get_topic_mapping()
    topics = set()
    for m in mappings:
        if m.get("course_id") == course_id:
            for t in m.get("role_skills_topics", []):
                topics.add(t)
    return list(topics)

def get_competency_details(competency_name):
    """Get competency details by canonical name or alias."""
    for comp in _get_competencies():
        canonical = comp.get("canonical_name", "")
        aliases = comp.get("source_names", [])
        
        # Check canonical
        if competency_name.lower() == canonical.lower():
            return comp
            
        # Check aliases
        for alias in aliases:
            if competency_name.lower() == alias.lower():
                return comp
    return None
