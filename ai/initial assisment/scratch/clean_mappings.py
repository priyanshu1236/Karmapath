import json

def is_topic_in_course(topic, course):
    t_clean = topic.lower().strip(" .")
    if not t_clean: return False
    
    # check title
    if t_clean in course.get("title", "").lower(): return True
    # check description
    if t_clean in course.get("description", "").lower(): return True
    
    # check learning structure
    ls = course.get("learning_structure", {})
    if isinstance(ls, dict):
        if t_clean in str(ls.get("learning_outcomes", "")).lower(): return True
        if t_clean in str(ls.get("modules", "")).lower(): return True
    return False

with open('data/courses/courses.json') as f:
    courses = json.load(f)['courses']
    
with open('data/courses/course_topic_mapping.json') as f:
    mapping_data = json.load(f)

course_dict = {c['course_id']: c for c in courses}

removed_count = 0
kept_count = 0

for m in mapping_data['mappings']:
    cid = m.get('course_id')
    if not cid or cid not in course_dict:
        m['role_skills_topics'] = []
        continue
    
    course = course_dict[cid]
    valid_topics = []
    original_topics = m.get('role_skills_topics', [])
    for t in original_topics:
        if is_topic_in_course(t, course):
            valid_topics.append(t)
            kept_count += 1
        else:
            removed_count += 1
            
    m['role_skills_topics'] = valid_topics

with open('data/courses/course_topic_mapping.json', 'w') as f:
    json.dump(mapping_data, f, indent=2)

print(f"Cleanup complete. Kept {kept_count} mappings. Removed {removed_count} noisy mappings.")
