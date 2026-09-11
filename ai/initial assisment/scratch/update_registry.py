import json

aliases = {
    "COMP-AGRICULTURAL-STATISTICS": ["Agricultural Statistics", "Crop Estimation", "Agricultural Surveys", "Crop yield estimation"],
    "COMP-SURVEY-DESIGN": ["Survey Design", "Questionnaire Design", "Sampling Frame"],
    "COMP-SAMPLING": ["Sampling", "Stratified Sampling", "Sampling Error"],
    "COMP-DATA-QUALITY": ["Data Quality", "Accuracy", "Timeliness"],
    "COMP-GIS": ["GIS", "Spatial Analysis", "Spatial Data Processing"],
    "COMP-PYTHON-DATA-ANALYSIS": ["Python", "Data Analysis", "Data Handling", "pandas", "Chart Selection"]
}

with open('data/competencies/competency_registry.json') as f:
    registry = json.load(f)

for comp in registry['competencies']:
    cid = comp['competency_id']
    if cid in aliases:
        # Add aliases that are not already present
        for a in aliases[cid]:
            if a not in comp['source_names']:
                comp['source_names'].append(a)

with open('data/competencies/competency_registry.json', 'w') as f:
    json.dump(registry, f, indent=2)

print("Updated aliases.")
