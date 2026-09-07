import sys
from pathlib import Path
import os
import json

# Add ai to sys path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from ai.app.data.catalog import get_all_roles, get_all_courses, get_role, get_course, get_courses_for_role

def test_roles_load():
    roles = get_all_roles()
    assert len(roles) > 0, "Roles should not be empty"

def test_courses_load():
    courses = get_all_courses()
    assert len(courses) > 0, "Courses should not be empty"

def test_roles_unique():
    roles = get_all_roles()
    role_ids = [r.get("role_id") for r in roles if r.get("role_id")]
    assert len(role_ids) == len(set(role_ids)), "Role IDs should be unique"

def test_courses_unique():
    courses = get_all_courses()
    course_ids = [c.get("course_id") for c in courses if c.get("course_id")]
    assert len(course_ids) == len(set(course_ids)), "Course IDs should be unique"

def test_role_course_mapping_validity():
    roles = get_all_roles()
    for r in roles:
        role_name = r.get("title")
        if role_name:
            courses = get_courses_for_role(role_name)
            for c in courses:
                assert c is not None, "Mapped course should exist"

def test_role_lookup():
    roles = get_all_roles()
    if roles:
        r = get_role(roles[0].get("title"))
        assert r is not None, "Should be able to lookup a role by title"

def test_course_lookup():
    courses = get_all_courses()
    if courses:
        c = get_course(courses[0].get("course_id"))
        assert c is not None, "Should be able to lookup a course by ID"

def test_get_courses_for_role():
    roles = get_all_roles()
    if roles:
        r_title = roles[0].get("title")
        # Just check it returns a list
        courses = get_courses_for_role(r_title)
        assert isinstance(courses, list), "Should return a list of courses"

def test_nonexistent_role():
    assert get_role("Nonexistent Role 12345") is None

def test_nonexistent_course():
    assert get_course("Nonexistent Course 12345") is None

if __name__ == "__main__":
    test_roles_load()
    test_courses_load()
    test_roles_unique()
    test_courses_unique()
    test_role_course_mapping_validity()
    test_role_lookup()
    test_course_lookup()
    test_get_courses_for_role()
    test_nonexistent_role()
    test_nonexistent_course()
    print("All tests passed!")
