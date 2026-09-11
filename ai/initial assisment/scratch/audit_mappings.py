import json

with open('data/courses/courses.json') as f:
    courses = json.load(f)['courses']
with open('data/courses/course_topic_mapping.json') as f:
    mappings = json.load(f)['mappings']

course_dict = {c['course_id']: c for c in courses}

for m in mappings:
    cid = m.get('course_id')
    if not cid or cid not in course_dict: continue
    c_title = course_dict[cid].get('title', 'Unknown')
    topics = m.get('role_skills_topics', [])
    print(f"[{cid}] {c_title}")
    print(f"  Topics: {topics}\n")
