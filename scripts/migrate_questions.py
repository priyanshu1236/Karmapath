import json

with open("data/assessments/question_bank_statistical_role.json", "r") as f:
    qbank = json.load(f)

comp_map = {
    "Agricultural Statistics": "COMP-AGRICULTURAL-STATISTICS",
    "Survey Design": "COMP-SURVEY-DESIGN",
    "Sampling": "COMP-SAMPLING",
    "Data Quality": "COMP-DATA-QUALITY",
    "GIS": "COMP-GIS",
    "Python / Data Analysis": "COMP-PYTHON-DATA-ANALYSIS"
}

for q in qbank:
    if "competency" in q and q["competency"] in comp_map:
        q["competency_id"] = comp_map[q["competency"]]

with open("data/assessments/question_bank_statistical_role.json", "w") as f:
    json.dump(qbank, f, indent=2)

print("Migrated question bank.")
