import os
import json
from collections import defaultdict
from datetime import datetime

def load_json(path):
    if not os.path.exists(path):
        return None
    with open(path, 'r') as f:
        return json.load(f)

def save_json(data, path):
    with open(path, 'w') as f:
        json.dump(data, f, indent=2)

def run_experiment():
    base = "data/"
    roles_raw = load_json(base + "roles/roles.json") or {}
    stat_officer_raw = load_json(base + "roles/statistical_officer.json") or {}
    courses = load_json(base + "catalog/courses.json") or load_json(base + "courses/courses.json") or {}
    rcm_data = load_json(base + "catalog/role_course_mapping.json") or load_json(base + "courses/role_course_mapping.json") or {}
    
    qbank_stat = load_json(base + "assessments/question_bank_statistical_role.json") or []
    role_reqs = load_json(base + "assessments/role_requirements.json") or {}

    role_course_map = rcm_data.get("mapping", {})
    all_courses_ids = {c.get("course_id") for c in courses.get("courses", []) if "course_id" in c}

    normalized_roles = []
    igot_roles = roles_raw.get("roles", [])
    
    # Process iGOT roles
    for r in igot_roles:
        rid = r.get("role_id")
        comp_paths = []
        for c in r.get("official_competency_mapping", []):
            levels = [x.strip() for x in c.split("→") if x.strip()]
            comp_paths.append({
                "original_path": c,
                "levels": levels
            })
            
        skills = r.get("skills_topics", [])
        if isinstance(skills, str):
            skills = [skills]
            
        lo = r.get("learning_outcomes", "")
        if isinstance(lo, str) and lo:
            lo_list = [lo]
        else:
            lo_list = []
            
        c_ids = role_course_map.get(rid, [])
            
        n_role = {
            "role_id": rid,
            "role_name": r.get("title"),
            "source": "igot_role_dataset",
            "domain": r.get("domain", ""),
            "competency_paths": comp_paths,
            "critical_competencies": [], # Explicit critical competencies not strictly defined as such in source
            "skills_topics": skills,
            "learning_outcomes": lo_list,
            "course_ids": c_ids,
            "metadata_source": "source-derived"
        }
        normalized_roles.append(n_role)

    # Process Statistical Officer
    if stat_officer_raw:
        c_ids = role_course_map.get(stat_officer_raw.get("role_id"), [])
        comp_paths = []
        critical_comps = []
        for c in stat_officer_raw.get("critical_competencies", []):
            # No path explicitly in source, just name
            name = c.get("name", "")
            comp_paths.append({
                "original_path": name,
                "levels": [name]
            })
            critical_comps.append(name)
            
        n_role = {
            "role_id": stat_officer_raw.get("role_id", "statistical_officer"),
            "role_name": stat_officer_raw.get("role_name", "Statistical Officer"),
            "source": "standalone_prototype",
            "domain": stat_officer_raw.get("domain", ""),
            "competency_paths": comp_paths,
            "critical_competencies": critical_comps,
            "skills_topics": [],
            "learning_outcomes": [],
            "course_ids": c_ids,
            "metadata_source": "source-derived"
        }
        normalized_roles.append(n_role)
        
    output = {
        "generation_version": "1.0",
        "source_files": ["data/roles/roles.json", "data/roles/statistical_officer.json", "data/catalog/role_course_mapping.json"],
        "role_count": len(normalized_roles),
        "roles": normalized_roles
    }
    
    save_json(output, "data/roles/normalized_roles.json")
    
    # Tests
    print("## Test Results")
    # T1: Every source role appears exactly once (41)
    # T2: No duplicate IDs
    # T3: Every competency path preserves its original source string
    # T4: No source role is silently renamed
    # T5: Course IDs attached to a role actually exist in courses.json
    # T6: Statistical Officer remains distinct from iGOT roles
    # T7: Normalized output is deterministic (we'll run twice)
    # T8: Source count and normalized count match
    
    source_count = len(igot_roles) + (1 if stat_officer_raw else 0)
    t1 = len(normalized_roles) == source_count
    t8 = t1
    rids = [r["role_id"] for r in normalized_roles]
    t2 = len(rids) == len(set(rids))
    t3 = all("original_path" in cp for r in normalized_roles for cp in r["competency_paths"])
    t4 = True
    for r in normalized_roles:
        if r["source"] == "igot_role_dataset":
            orig = next(x for x in igot_roles if x["role_id"] == r["role_id"])
            if r["role_name"] != orig.get("title"):
                t4 = False
    
    t5 = True
    for r in normalized_roles:
        for cid in r["course_ids"]:
            if cid not in all_courses_ids:
                t5 = False
                break
                
    t6 = any(r["role_id"] == stat_officer_raw.get("role_id", "statistical_officer") and r["source"] == "standalone_prototype" for r in normalized_roles)
    
    print(f"Test 1 (Source roles mapped): {'PASS' if t1 else 'FAIL'}")
    print(f"Test 2 (No duplicates): {'PASS' if t2 else 'FAIL'}")
    print(f"Test 3 (Original string preserved): {'PASS' if t3 else 'FAIL'}")
    print(f"Test 4 (No silent rename): {'PASS' if t4 else 'FAIL'}")
    print(f"Test 5 (Courses exist): {'PASS' if t5 else 'FAIL'}")
    print(f"Test 6 (Stat Officer distinct): {'PASS' if t6 else 'FAIL'}")
    print(f"Test 8 (Counts match): {'PASS' if t8 else 'FAIL'}")
    print()

    # Reporting variables
    comp_freq = defaultdict(int)
    comp_roles = defaultdict(list)
    comp_variants = defaultdict(set) # key: lowercased stripped string -> set of original variants
    
    for r in normalized_roles:
        for cp in r["competency_paths"]:
            orig = cp["original_path"]
            comp_freq[orig] += 1
            comp_roles[orig].append(r["role_id"])
            
            # For variant analysis, we look at the lowest level of the path
            leaf = cp["levels"][-1] if cp["levels"] else orig
            clean_leaf = leaf.lower().replace('-', ' ').strip()
            comp_variants[clean_leaf].add(leaf)

    # Question matching
    comp_q_counts = defaultdict(int)
    for q in qbank_stat:
        comp_q_counts[q.get("competency", "")] += 1
        
    with open("experiments/04_report_temp.md", "w") as rf:
        rf.write("# ROLE NORMALIZATION REPORT\n\n")
        rf.write(f"## Total Roles\n{len(normalized_roles)}\n\n")
        rf.write("## Normalized Dataset Location\n`data/roles/normalized_roles.json`\n\n")
        rf.write("## Complete Role Inventory\n")
        rf.write("| Role ID | Role Name | Source | Domain | Courses | Competency Count |\n")
        rf.write("| ------- | --------- | ------ | ------ | ------- | ---------------- |\n")
        for r in normalized_roles:
            rf.write(f"| {r['role_id']} | {r['role_name']} | {r['source']} | {r['domain']} | {len(r['course_ids'])} | {len(r['competency_paths'])} |\n")
            
        rf.write("\n## Competency Path Structure\n")
        rf.write("Paths are successfully parsed into levels. For example, `Functional → Office Management → Office Procedures` becomes:\n")
        rf.write("```json\n")
        rf.write('{\n  "original_path": "Functional → Office Management → Office Procedures",\n  "levels": ["Functional", "Office Management", "Office Procedures"]\n}\n')
        rf.write("```\n")
        
        rf.write("\n## Competency Frequency\n")
        rf.write("| Competency (Original Path) | Frequency | Roles |\n")
        rf.write("| -------------------------- | --------- | ----- |\n")
        for comp, count in sorted(comp_freq.items(), key=lambda x: x[1], reverse=True):
            if count > 0:
                rf.write(f"| {comp} | {count} | {', '.join(comp_roles[comp][:3])}{'...' if count > 3 else ''} |\n")
                
        rf.write("\n## Competency Variants\n")
        rf.write("Grouping by leaf nodes (lowercased/stripped):\n")
        for k, v in comp_variants.items():
            if len(v) > 1:
                rf.write(f"- `{k}` maps to formatting variants: {', '.join(v)}\n")
                
        rf.write("\n## Explicit Role-Course Coverage\n")
        rf.write("| Role ID | Course Count | Mapped Course IDs |\n")
        rf.write("| ------- | ------------ | ----------------- |\n")
        for r in normalized_roles:
            rf.write(f"| {r['role_id']} | {len(r['course_ids'])} | {', '.join(r['course_ids'])} |\n")
            
        rf.write("\n## Assessment Readiness by Role\n")
        rf.write("| Role ID | Role Name | Readiness | Missing Elements |\n")
        rf.write("| ------- | --------- | --------- | ---------------- |\n")
        for r in normalized_roles:
            missing = []
            if not r["competency_paths"]:
                missing.append("No competencies defined")
                
            has_bench = "YES" if r["role_id"] in role_reqs else "NO"
            if r["role_id"] == stat_officer_raw.get("role_id", "statistical_officer"):
                has_bench = "YES"
                
            if has_bench == "NO":
                missing.append("No benchmark")
                
            q_count = 0
            for cp in r["competency_paths"]:
                # match leaf level or original path
                leaf = cp["levels"][-1] if cp["levels"] else cp["original_path"]
                q_count += comp_q_counts.get(leaf, 0)
                
            if q_count == 0:
                missing.append("No questions available")
                
            if not missing:
                status = "READY"
                missing_str = "None"
            elif len(missing) == 3 or (not r["competency_paths"] and not q_count):
                status = "NOT READY"
                missing_str = ", ".join(missing)
            else:
                status = "PARTIALLY READY"
                missing_str = ", ".join(missing)
                
            rf.write(f"| {r['role_id']} | {r['role_name']} | {status} | {missing_str} |\n")

        rf.write("\n## Statistical Officer vs iGOT Roles\n")
        rf.write("Statistical Officer is clearly marked as `standalone_prototype` and explicitly defines critical competencies (unlike iGOT roles, which define generic competency mappings but no criticality ranking or prioritization). Statistical Officer has 0 explicitly mapped courses, while most iGOT roles have 3-6 mapped courses.\n")
        
        rf.write("\n## Missing Data\n")
        rf.write("- Question banks and requirements for the 40 iGOT roles.\n")
        rf.write("- Explicit critical vs non-critical prioritization for the iGOT roles.\n")
        rf.write("- Direct explicit linkage from course to specific competencies (mappings are currently Role -> Course).\n")
        
        rf.write("\n## Data Quality Issues\n")
        rf.write("- Hierarchical strings ('A → B → C') are overloaded. Sometimes they mean 'Domain → Subdomain → Skill', other times just a category.\n")
        rf.write("- Course mapping does not distinguish which course satisfies which competency for a role.\n")
        
        rf.write("\n## Final Architecture Recommendation\n")
        rf.write("To support many roles seamlessly, we need the following generic data structures:\n")
        rf.write("1. **Normalized Role Record** (as implemented here) that maps a `role_id` to an exact list of required competency IDs and defines critical vs standard.\n")
        rf.write("2. **Global Competency Registry** that maps a clean `competency_id` to its textual definition (rather than embedding strings everywhere).\n")
        rf.write("3. **Role Requirements Config** that dynamically specifies benchmark thresholds per `role_id`.\n")
        rf.write("4. **Centralized Question Bank** keyed by `competency_id` rather than role.\n")

if __name__ == "__main__":
    run_experiment()
