import json
from pathlib import Path
from datetime import datetime

AI_DIR = Path("/home/priyanshu/dev/sih/ai/initial assisment")
DATA_DIR = AI_DIR / "data"

# 1. Update roles.json
roles_path = DATA_DIR / "roles" / "roles.json"
with open(roles_path, "r") as f:
    roles_data = json.load(f)

if not any(r.get("role_id") == "faculty" for r in roles_data["roles"]):
    roles_data["roles"].append({
        "role_id": "faculty",
        "role_number": 41,
        "title": "College / University Faculty",
        "provider": "SIH Prototype",
        "recently_updated": datetime.now().strftime("%d %b %Y"),
        "programme_duration": "0h 0m",
        "number_of_courses": 0,
        "official_competency_mapping": [
            "Faculty → Subject Knowledge & Explanation",
            "Faculty → Classroom Teaching & Student Engagement",
            "Faculty → Lesson & Course Planning",
            "Faculty → Exams, Evaluation & Feedback",
            "Faculty → Digital Tools for Teaching",
            "Faculty → Research & Academic Work"
        ],
        "programme_description": "Demo role for College/University Faculty",
        "learning_outcomes": "Demonstrates capability in teaching, planning, digital tools, and research.",
        "skills_topics": ["Teaching", "Research", "Digital Tools", "Assessment"],
        "data_quality": {
            "role_title_source": "sih_prototype",
            "provider_source": "sih_prototype",
            "duration_source": "sih_prototype",
            "competency_mapping_source": "sih_prototype",
            "description_source": "sih_prototype",
            "learning_outcomes_source": "sih_prototype",
            "skills_topics_source": "sih_prototype"
        }
    })
    with open(roles_path, "w") as f:
        json.dump(roles_data, f, indent=2)

# 2. Update normalized_roles.json
norm_roles_path = DATA_DIR / "roles" / "normalized_roles.json"
with open(norm_roles_path, "r") as f:
    norm_roles_data = json.load(f)

if not any(r.get("role_id") == "faculty" for r in norm_roles_data["roles"]):
    norm_roles_data["roles"].append({
        "role_id": "faculty",
        "role_name": "College / University Faculty",
        "source": "sih_prototype",
        "domain": "Education",
        "competency_paths": [
            {
                "original_name": "Subject Knowledge & Explanation",
                "path_string": "Faculty → Subject Knowledge & Explanation"
            },
            {
                "original_name": "Classroom Teaching & Student Engagement",
                "path_string": "Faculty → Classroom Teaching & Student Engagement"
            },
            {
                "original_name": "Lesson & Course Planning",
                "path_string": "Faculty → Lesson & Course Planning"
            },
            {
                "original_name": "Exams, Evaluation & Feedback",
                "path_string": "Faculty → Exams, Evaluation & Feedback"
            },
            {
                "original_name": "Digital Tools for Teaching",
                "path_string": "Faculty → Digital Tools for Teaching"
            },
            {
                "original_name": "Research & Academic Work",
                "path_string": "Faculty → Research & Academic Work"
            }
        ],
        "courses": []
    })
    with open(norm_roles_path, "w") as f:
        json.dump(norm_roles_data, f, indent=2)

# 3. Update competency_registry.json
comp_registry_path = DATA_DIR / "competencies" / "competency_registry.json"
with open(comp_registry_path, "r") as f:
    comp_registry_data = json.load(f)

faculty_comps = [
    {
        "competency_id": "COMP-FACULTY-SUBJECT-EXPLANATION",
        "canonical_name": "Subject Knowledge & Explanation",
        "status": "active",
        "source_names": ["Subject Knowledge & Explanation"],
        "source_roles": ["faculty"],
        "notes": "Added for SIH prototype",
        "evidence": []
    },
    {
        "competency_id": "COMP-FACULTY-CLASSROOM-ENGAGEMENT",
        "canonical_name": "Classroom Teaching & Student Engagement",
        "status": "active",
        "source_names": ["Classroom Teaching & Student Engagement"],
        "source_roles": ["faculty"],
        "notes": "Added for SIH prototype",
        "evidence": []
    },
    {
        "competency_id": "COMP-FACULTY-COURSE-PLANNING",
        "canonical_name": "Lesson & Course Planning",
        "status": "active",
        "source_names": ["Lesson & Course Planning"],
        "source_roles": ["faculty"],
        "notes": "Added for SIH prototype",
        "evidence": []
    },
    {
        "competency_id": "COMP-FACULTY-ASSESSMENT-FEEDBACK",
        "canonical_name": "Exams, Evaluation & Feedback",
        "status": "active",
        "source_names": ["Exams, Evaluation & Feedback"],
        "source_roles": ["faculty"],
        "notes": "Added for SIH prototype",
        "evidence": []
    },
    {
        "competency_id": "COMP-FACULTY-DIGITAL-TEACHING",
        "canonical_name": "Digital Tools for Teaching",
        "status": "active",
        "source_names": ["Digital Tools for Teaching"],
        "source_roles": ["faculty"],
        "notes": "Added for SIH prototype",
        "evidence": []
    },
    {
        "competency_id": "COMP-FACULTY-RESEARCH-ACADEMIC",
        "canonical_name": "Research & Academic Work",
        "status": "active",
        "source_names": ["Research & Academic Work"],
        "source_roles": ["faculty"],
        "notes": "Added for SIH prototype",
        "evidence": []
    }
]

for fc in faculty_comps:
    if not any(c.get("competency_id") == fc["competency_id"] for c in comp_registry_data.get("competencies", [])):
        comp_registry_data["competencies"].append(fc)

with open(comp_registry_path, "w") as f:
    json.dump(comp_registry_data, f, indent=2)

# 4. Update role_requirements.json
role_req_path = DATA_DIR / "assessments" / "role_requirements.json"
with open(role_req_path, "r") as f:
    role_req_data = json.load(f)

if "College / University Faculty" not in role_req_data:
    role_req_data["College / University Faculty"] = {
        "Subject Knowledge & Explanation": 80,
        "Classroom Teaching & Student Engagement": 80,
        "Lesson & Course Planning": 80,
        "Exams, Evaluation & Feedback": 80,
        "Digital Tools for Teaching": 80,
        "Research & Academic Work": 80
    }
    with open(role_req_path, "w") as f:
        json.dump(role_req_data, f, indent=2)

# 5. Update assessment_blueprints.json
blueprints_path = DATA_DIR / "assessments" / "assessment_blueprints.json"
with open(blueprints_path, "r") as f:
    blueprints_data = json.load(f)

if "college_/_university_faculty" not in blueprints_data["initial_assessment"]:
    blueprints_data["initial_assessment"]["college_/_university_faculty"] = {
        "version": "v1",
        "question_count": 18,
        "competencies": {
            "COMP-FACULTY-SUBJECT-EXPLANATION": ["FAC-SUB-001", "FAC-SUB-002", "FAC-SUB-003"],
            "COMP-FACULTY-CLASSROOM-ENGAGEMENT": ["FAC-CLS-001", "FAC-CLS-002", "FAC-CLS-003"],
            "COMP-FACULTY-COURSE-PLANNING": ["FAC-PLAN-001", "FAC-PLAN-002", "FAC-PLAN-003"],
            "COMP-FACULTY-ASSESSMENT-FEEDBACK": ["FAC-ASM-001", "FAC-ASM-002", "FAC-ASM-003"],
            "COMP-FACULTY-DIGITAL-TEACHING": ["FAC-DIG-001", "FAC-DIG-002", "FAC-DIG-003"],
            "COMP-FACULTY-RESEARCH-ACADEMIC": ["FAC-RES-001", "FAC-RES-002", "FAC-RES-003"]
        }
    }
    with open(blueprints_path, "w") as f:
        json.dump(blueprints_data, f, indent=2)

# 6. Append Questions to question_bank_statistical_role.json
qbank_path = DATA_DIR / "assessments" / "question_bank_statistical_role.json"
with open(qbank_path, "r") as f:
    qbank_data = json.load(f)

faculty_questions = [
    {
        "id": "FAC-SUB-001",
        "competency": "Subject Knowledge & Explanation",
        "skill": "Simplifying Concepts",
        "difficulty": "easy",
        "marks": 1,
        "options": {
            "A": "Ask them to read the textbook chapter again and return during office hours",
            "B": "Break the concept down using a relatable real-world analogy and check their understanding",
            "C": "Tell the student that this concept will not be heavily tested on the final exam",
            "D": "Suggest they find a tutor or watch a video online"
        },
        "correct_answer": "B",
        "explanation": "Effective explanation involves breaking down complex topics using relatable analogies to aid understanding.",
        "question_text": "A student visits you after class expressing confusion about a core concept you just taught. They have read the material but still do not understand. What is the most effective approach?",
        "domain": "Education",
        "competency_id": "COMP-FACULTY-SUBJECT-EXPLANATION"
    },
    {
        "id": "FAC-SUB-002",
        "competency": "Subject Knowledge & Explanation",
        "skill": "Concept Application",
        "difficulty": "medium",
        "marks": 1,
        "options": {
            "A": "Provide a step-by-step example problem where you apply the formula to a real-world scenario",
            "B": "Have the student memorize the formula derivations",
            "C": "Assign a heavily theoretical essay about the formula",
            "D": "Reiterate the mathematical definition of the formula more slowly"
        },
        "correct_answer": "A",
        "explanation": "Application requires seeing how theory operates in practice through worked examples.",
        "question_text": "A student understands the formula you explained but cannot apply it to a real-world problem. What would be the most effective next step?",
        "domain": "Education",
        "competency_id": "COMP-FACULTY-SUBJECT-EXPLANATION"
    },
    {
        "id": "FAC-SUB-003",
        "competency": "Subject Knowledge & Explanation",
        "skill": "Handling Advanced Questions",
        "difficulty": "hard",
        "marks": 1,
        "options": {
            "A": "Make an educated guess to maintain authority in front of the class",
            "B": "Dismiss the question as irrelevant to the current syllabus",
            "C": "Acknowledge the excellent question, admit you don't have the exact answer right now, and promise to look into it for the next class",
            "D": "Immediately assign the question as homework for the entire class to figure out"
        },
        "correct_answer": "C",
        "explanation": "Acknowledging knowledge limits while committing to finding the answer models good academic behavior.",
        "question_text": "During a lecture, an advanced student asks a highly specific technical question that goes slightly beyond your immediate knowledge. How should you respond?",
        "domain": "Education",
        "competency_id": "COMP-FACULTY-SUBJECT-EXPLANATION"
    },
    {
        "id": "FAC-CLS-001",
        "competency": "Classroom Teaching & Student Engagement",
        "skill": "Pacing & Adaptability",
        "difficulty": "easy",
        "marks": 1,
        "options": {
            "A": "Continue at the planned pace, advising struggling students to study harder",
            "B": "Stop and completely restart the topic from the beginning for everyone",
            "C": "Pair the students for a quick peer-learning activity, allowing the faster students to help those struggling",
            "D": "Skip the topic completely since half the class doesn't understand it"
        },
        "correct_answer": "C",
        "explanation": "Peer learning keeps advanced students engaged while providing help to struggling students.",
        "question_text": "Half of the students in your class understand a topic while the rest are clearly struggling. How would you handle the next part of the lesson?",
        "domain": "Education",
        "competency_id": "COMP-FACULTY-CLASSROOM-ENGAGEMENT"
    },
    {
        "id": "FAC-CLS-002",
        "competency": "Classroom Teaching & Student Engagement",
        "skill": "Maintaining Engagement",
        "difficulty": "medium",
        "marks": 1,
        "options": {
            "A": "Speak louder and faster to get through the material quickly",
            "B": "Pause the lecture and introduce a quick interactive poll, question, or discussion prompt related to the topic",
            "C": "Give an immediate surprise quiz to force them to pay attention",
            "D": "Ignore them and focus on the few students who are paying attention"
        },
        "correct_answer": "B",
        "explanation": "Interactive elements reset student attention spans effectively during long lectures.",
        "question_text": "You notice that student attention is dropping during a 90-minute lecture on a theoretical topic. What is the most appropriate way to re-engage the class?",
        "domain": "Education",
        "competency_id": "COMP-FACULTY-CLASSROOM-ENGAGEMENT"
    },
    {
        "id": "FAC-CLS-003",
        "competency": "Classroom Teaching & Student Engagement",
        "skill": "Classroom Management",
        "difficulty": "hard",
        "marks": 1,
        "options": {
            "A": "Publicly reprimand the student in front of the entire class",
            "B": "Ignore the behavior completely to avoid a confrontation",
            "C": "Ask the student a direct, difficult question about the material to catch them off guard",
            "D": "Speak with the student privately after class to understand the issue and set clear expectations"
        },
        "correct_answer": "D",
        "explanation": "Private conversations resolve behavioral issues without escalating them publicly or shaming the student.",
        "question_text": "A student consistently disrupts class by talking to their peers and checking their phone, distracting others. What is the best initial approach to resolve this?",
        "domain": "Education",
        "competency_id": "COMP-FACULTY-CLASSROOM-ENGAGEMENT"
    },
    {
        "id": "FAC-PLAN-001",
        "competency": "Lesson & Course Planning",
        "skill": "Syllabus Management",
        "difficulty": "medium",
        "marks": 1,
        "options": {
            "A": "Rush through all remaining topics by reading slides quickly",
            "B": "Review the learning outcomes to identify the most critical foundational topics to cover thoroughly, and assign the rest as supplementary reading",
            "C": "Cancel the final exam since the syllabus wasn't finished",
            "D": "Extend the class times by an hour every day without consulting the administration"
        },
        "correct_answer": "B",
        "explanation": "Prioritizing core learning outcomes ensures critical knowledge is delivered even when time is short.",
        "question_text": "You are behind schedule and still have several important topics left in the syllabus before the end of the semester. What should you consider before deciding what to cover next?",
        "domain": "Education",
        "competency_id": "COMP-FACULTY-COURSE-PLANNING"
    },
    {
        "id": "FAC-PLAN-002",
        "competency": "Lesson & Course Planning",
        "skill": "Sequencing",
        "difficulty": "easy",
        "marks": 1,
        "options": {
            "A": "Alphabetically, to keep the syllabus organized",
            "B": "By starting with the most complex, theoretical concepts first to get them out of the way",
            "C": "By building from foundational concepts to more complex applications",
            "D": "Randomly, to keep students guessing and engaged"
        },
        "correct_answer": "C",
        "explanation": "Scaffolding knowledge from simple to complex is the most effective pedagogical sequencing.",
        "question_text": "When designing a new course module from scratch, how should you sequence the topics?",
        "domain": "Education",
        "competency_id": "COMP-FACULTY-COURSE-PLANNING"
    },
    {
        "id": "FAC-PLAN-003",
        "competency": "Lesson & Course Planning",
        "skill": "Alignment",
        "difficulty": "hard",
        "marks": 1,
        "options": {
            "A": "Add the software to the syllabus and increase the credit hours for the course",
            "B": "Map the new software to the existing learning outcomes to see if it enhances them before integrating it",
            "C": "Completely rewrite the course syllabus to focus solely on the new software",
            "D": "Ignore the software; sticking strictly to the original plan is always best"
        },
        "correct_answer": "B",
        "explanation": "New tools should serve the learning outcomes, not dictate them.",
        "question_text": "You discover a new, highly-rated software tool midway through planning your course. How should you decide whether to integrate it into your lessons?",
        "domain": "Education",
        "competency_id": "COMP-FACULTY-COURSE-PLANNING"
    },
    {
        "id": "FAC-ASM-001",
        "competency": "Exams, Evaluation & Feedback",
        "skill": "Formative Assessment",
        "difficulty": "easy",
        "marks": 1,
        "options": {
            "A": "Wait until the final exam to assess their knowledge",
            "B": "Ask 'Does everyone understand?' and move on if no one speaks up",
            "C": "Use a short, ungraded quiz or \"exit ticket\" at the end of the class",
            "D": "Assign a massive project due the next day"
        },
        "correct_answer": "C",
        "explanation": "Formative, low-stakes assessments provide immediate feedback on student comprehension.",
        "question_text": "You want to quickly check if students grasped the main concept of today's lecture. What is the most effective method?",
        "domain": "Education",
        "competency_id": "COMP-FACULTY-ASSESSMENT-FEEDBACK"
    },
    {
        "id": "FAC-ASM-002",
        "competency": "Exams, Evaluation & Feedback",
        "skill": "Remediation",
        "difficulty": "medium",
        "marks": 1,
        "options": {
            "A": "Assume the students didn't study hard enough and move to the next chapter",
            "B": "Lower the passing grade for the assessment",
            "C": "Review the poorly performed section in the next class to clarify misunderstandings",
            "D": "Give all students full marks for that section to be fair"
        },
        "correct_answer": "C",
        "explanation": "Widespread failure usually indicates a teaching gap or widespread misconception that requires direct reteaching.",
        "question_text": "Most students performed poorly on one specific section of a recent midterm exam. What would be the most useful first step?",
        "domain": "Education",
        "competency_id": "COMP-FACULTY-ASSESSMENT-FEEDBACK"
    },
    {
        "id": "FAC-ASM-003",
        "competency": "Exams, Evaluation & Feedback",
        "skill": "Constructive Feedback",
        "difficulty": "hard",
        "marks": 1,
        "options": {
            "A": "Write 'Poorly done' on the front page and return it",
            "B": "Provide specific comments highlighting exactly what was done well and actionable steps to improve the weak areas",
            "C": "Edit their essay for them so they see what a perfect paper looks like",
            "D": "Only focus on the grammatical errors since they are easiest to fix"
        },
        "correct_answer": "B",
        "explanation": "Effective feedback is specific, balanced, and actionable.",
        "question_text": "A student submits an essay that is well-researched but poorly structured. How should you structure your feedback?",
        "domain": "Education",
        "competency_id": "COMP-FACULTY-ASSESSMENT-FEEDBACK"
    },
    {
        "id": "FAC-DIG-001",
        "competency": "Digital Tools for Teaching",
        "skill": "Hybrid Engagement",
        "difficulty": "medium",
        "marks": 1,
        "options": {
            "A": "Focus only on the in-person students since they are physically present",
            "B": "Require remote students to submit a written summary after class instead of participating",
            "C": "Use digital polling tools and explicitly direct questions to the online cohort to draw them in",
            "D": "Turn off the camera and rely solely on audio to reduce bandwidth issues"
        },
        "correct_answer": "C",
        "explanation": "Active inclusion strategies and digital tools help bridge the gap in hybrid environments.",
        "question_text": "You are conducting a hybrid class, and students joining remotely are participating much less than those in the classroom. What would be the most appropriate response?",
        "domain": "Education",
        "competency_id": "COMP-FACULTY-DIGITAL-TEACHING"
    },
    {
        "id": "FAC-DIG-002",
        "competency": "Digital Tools for Teaching",
        "skill": "LMS Utilization",
        "difficulty": "easy",
        "marks": 1,
        "options": {
            "A": "Email the readings to each student individually every week",
            "B": "Upload all materials, assignments, and a clear schedule to the university's Learning Management System (LMS)",
            "C": "Print physical copies and hand them out, ignoring the digital tools",
            "D": "Post links on your personal social media accounts"
        },
        "correct_answer": "B",
        "explanation": "An LMS provides a centralized, accessible, and secure location for course administration.",
        "question_text": "You want to ensure students have easy, organized access to course readings and assignment submission links. What is the best approach?",
        "domain": "Education",
        "competency_id": "COMP-FACULTY-DIGITAL-TEACHING"
    },
    {
        "id": "FAC-DIG-003",
        "competency": "Digital Tools for Teaching",
        "skill": "Troubleshooting",
        "difficulty": "hard",
        "marks": 1,
        "options": {
            "A": "Cancel the class immediately",
            "B": "Have a low-tech backup plan ready, such as switching to a whiteboard or a class discussion, while briefly trying to resolve the issue",
            "C": "Spend the entire class period trying to fix the projector",
            "D": "Read directly from your notes without engaging the students"
        },
        "correct_answer": "B",
        "explanation": "Faculty must have adaptable backup plans for technology failures to preserve instructional time.",
        "question_text": "Five minutes into your lecture, the classroom projector fails, and your presentation cannot be displayed. What is the most professional response?",
        "domain": "Education",
        "competency_id": "COMP-FACULTY-DIGITAL-TEACHING"
    },
    {
        "id": "FAC-RES-001",
        "competency": "Research & Academic Work",
        "skill": "Literature Review",
        "difficulty": "easy",
        "marks": 1,
        "options": {
            "A": "Immediately begin writing the methodology section",
            "B": "Conduct a comprehensive literature review using academic databases to understand existing knowledge",
            "C": "Collect primary data before deciding on a research question",
            "D": "Write the abstract based on what you assume the results will be"
        },
        "correct_answer": "B",
        "explanation": "A literature review establishes the foundation and context for any new research project.",
        "question_text": "You are beginning a new academic research project and need to understand what has already been studied on the topic. What should you do first?",
        "domain": "Education",
        "competency_id": "COMP-FACULTY-RESEARCH-ACADEMIC"
    },
    {
        "id": "FAC-RES-002",
        "competency": "Research & Academic Work",
        "skill": "Citation & Ethics",
        "difficulty": "medium",
        "marks": 1,
        "options": {
            "A": "Include it without citation since you are paraphrasing",
            "B": "Only cite it if you use a direct quote",
            "C": "Properly cite the original authors according to the required academic style guide",
            "D": "Change a few words so you can claim it as original thought"
        },
        "correct_answer": "C",
        "explanation": "Academic integrity requires citing sources even when paraphrasing other researchers' ideas.",
        "question_text": "While writing a research paper, you want to include an idea you read in another scholar's article, but you are paraphrasing it rather than quoting it directly. What is the correct protocol?",
        "domain": "Education",
        "competency_id": "COMP-FACULTY-RESEARCH-ACADEMIC"
    },
    {
        "id": "FAC-RES-003",
        "competency": "Research & Academic Work",
        "skill": "Peer Review",
        "difficulty": "hard",
        "marks": 1,
        "options": {
            "A": "Withdraw the paper and abandon the research",
            "B": "Argue aggressively with the editor that the reviewers are biased",
            "C": "Carefully read the feedback, address the valid critiques by revising the manuscript, and provide a polite point-by-point response",
            "D": "Submit the exact same paper to another journal without making changes"
        },
        "correct_answer": "C",
        "explanation": "Constructive response to peer review is a standard and necessary part of the academic publishing process.",
        "question_text": "You submit a manuscript to a journal, and it is returned with a request for \"major revisions\" based on peer reviewer comments. Some comments seem highly critical. How should you handle this?",
        "domain": "Education",
        "competency_id": "COMP-FACULTY-RESEARCH-ACADEMIC"
    }
]

for fq in faculty_questions:
    if not any(q.get("id") == fq["id"] for q in qbank_data):
        qbank_data.append(fq)

with open(qbank_path, "w") as f:
    json.dump(qbank_data, f, indent=2)

print("Faculty data successfully added!")
