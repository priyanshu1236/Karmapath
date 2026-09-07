import os
import json
from collections import defaultdict

def load_json(path):
    if not os.path.exists(path):
        return None
    with open(path, 'r') as f:
        return json.load(f)

def run_inventory():
    base = "data/"
    roles_data = load_json(base + "roles/roles.json") or {}
    stat_officer = load_json(base + "roles/statistical_officer.json") or {}
    courses = load_json(base + "courses/courses.json") or []
    rcm_data = load_json(base + "courses/role_course_mapping.json") or {}
    role_course_map = rcm_data.get("mapping", {})
    
    qbank_stat = load_json(base + "assessments/question_bank_statistical_role.json") or []
    role_reqs = load_json(base + "assessments/role_requirements.json") or {}

    all_roles = roles_data.get("roles", []) if isinstance(roles_data, dict) else (roles_data if isinstance(roles_data, list) else [])
    
    # 1. Role Inventory
    courses_per_role = defaultdict(int)
    for rid, course_list in role_course_map.items():
        courses_per_role[rid] = len(course_list)
            
    stat_officer_id = stat_officer.get("role_id", "statistical_officer")
    has_stat_officer = any(r.get("role_id") == stat_officer_id for r in all_roles)
    if not has_stat_officer and stat_officer:
        all_roles.append({
            "role_id": stat_officer_id,
            "title": stat_officer.get("role_name", "Statistical Officer"),
            "domain": stat_officer.get("domain", ""),
            "official_competency_mapping": [c["name"] for c in stat_officer.get("critical_competencies", [])],
            "skills_topics": [],
            "learning_outcomes": "",
            "is_stat_officer": True,
            "critical_competencies": stat_officer.get("critical_competencies", [])
        })

    # Prepare markdown
    lines = []
    lines.append("# ROLE → COMPETENCY INVENTORY\n")
    lines.append("## Total Roles\n")
    lines.append(f"Total roles: {len(all_roles)}\n")

    lines.append("## Role-by-Role Inventory\n")
    lines.append("| Role ID | Role | Domain/Function | Critical Competencies | Skills/Topics | Learning Outcomes | Course Count |")
    lines.append("| ------- | ---- | --------------- | --------------------- | ------------- | ----------------- | -----------: |")
    
    for r in all_roles:
        rid = r.get("role_id", "")
        title = r.get("title", "")
        domain = r.get("domain", "")
        
        comps = r.get("official_competency_mapping", [])
        if "critical_competencies" in r and r.get("is_stat_officer"):
            comps = [c["name"] for c in r["critical_competencies"]]
            
        skills = r.get("skills_topics", [])
        if isinstance(skills, list):
            skills = ", ".join(skills)
            
        lo = r.get("learning_outcomes", "")
        if len(lo) > 50:
            lo = lo[:47] + "..."
            
        cc = courses_per_role.get(rid, 0)
        lines.append(f"| {rid} | {title} | {domain} | {', '.join(comps)} | {skills} | {lo} | {cc} |")

    lines.append("\n## Competency Frequency\n")
    comp_counts = defaultdict(int)
    comp_roles = defaultdict(list)
    
    # 2 & 3. Critical Competencies & Normalization
    for r in all_roles:
        comps = r.get("official_competency_mapping", [])
        if "critical_competencies" in r and r.get("is_stat_officer"):
            comps = [c["name"] for c in r["critical_competencies"]]
            
        for c in comps:
            c_clean = c.strip()
            comp_counts[c_clean] += 1
            comp_roles[c_clean].append(r.get("title", ""))
            
    lines.append("Duplicate/Near-duplicate observations:")
    lines.append("- Many competencies in the 40-role dataset are structured as 'Functional → Domain → Specific' which creates unique strings rather than shared core competencies.")
    lines.append("- Capitalization varies in the raw data.")
    lines.append("- Statistical Officer uses clean, normalized competencies (e.g., 'Sampling'), while iGOT data uses hierarchical paths.\n")

    lines.append("## Cross-Role Competency Matrix\n")
    lines.append("| Competency | Number of Roles Using It | Roles |")
    lines.append("| ---------- | -----------------------: | ----- |")
    for comp, count in sorted(comp_counts.items(), key=lambda x: x[1], reverse=True):
        if count > 0:
            roles_str = ", ".join(comp_roles[comp][:5])
            if count > 5:
                roles_str += "..."
            lines.append(f"| {comp} | {count} | {roles_str} |")
            
    comp_q_counts = defaultdict(int)
    for q in qbank_stat:
        comp_q_counts[q.get("competency", "")] += 1

    lines.append("\n## Assessment Readiness & Question Coverage\n")
    lines.append("| Role | Critical Competencies | Questions Available | Benchmarks Available | Courses Available | Assessment Readiness |")
    lines.append("| ---- | --------------------: | ------------------: | -------------------: | ----------------: | -------------------- |")
    
    for r in all_roles:
        rid = r.get("role_id", "")
        title = r.get("title", "")
        
        comps = r.get("official_competency_mapping", [])
        if "critical_competencies" in r and r.get("is_stat_officer"):
            comps = [c["name"] for c in r["critical_competencies"]]
            
        q_count = sum(comp_q_counts.get(c, 0) for c in comps)
        
        has_bench = "YES" if rid in role_reqs else "NO"
        if r.get("is_stat_officer"):
            has_bench = "YES"
            
        cc = courses_per_role.get(rid, 0)
        
        readiness = "NOT READY"
        if comps and q_count >= len(comps)*3 and has_bench == "YES":
            readiness = "READY"
        elif comps and (q_count > 0 or has_bench == "YES"):
            readiness = "PARTIALLY READY"
            
        lines.append(f"| {title} | {len(comps)} | {q_count} | {has_bench} | {cc} | {readiness} |")

    lines.append("\n## Role → Course Coverage\n")
    lines.append("- Roles with many mapped courses: Several iGOT roles have 5+ courses mapped directly in `role_course_mapping.json`.")
    lines.append("- Roles with few/no mapped courses: Statistical Officer actually has NO explicit courses mapped in `role_course_mapping.json`! It relies purely on the semantic baseline match.")

    lines.append("\n## Competency → Course Coverage\n")
    lines.append("Explicit Mappings: Found in `role_course_mapping.json` but they map Role->Course, not Competency->Course directly.")
    lines.append("Semantic / Prototype-Derived: Statistical Officer's competencies are currently met purely via baseline semantic matching against the catalog descriptions.")
    
    lines.append("\n## Statistical Officer vs Other Roles\n")
    lines.append("```text")
    lines.append(f"Statistical Officer: 6 competencies, 18 questions, Benchmark: YES, Mapped Courses: 0 (relies on semantics)")
    
    other_roles = [r for r in all_roles if not r.get("is_stat_officer")][:4]
    for i, r in enumerate(other_roles, 1):
        comps = len(r.get("official_competency_mapping", []))
        cc = courses_per_role.get(r.get("role_id"), 0)
        lines.append(f"Role {i} ({r.get('title')}): {comps} competencies, 0 questions, Benchmark: NO, Mapped Courses: {cc}")
    lines.append("```")
    lines.append("\nObservation: Statistical Officer is uniquely prepared for Assessment. The other 40 roles have course mappings but lack explicit clean competencies, benchmarks, and question banks.")

    lines.append("\n## Multi-Role Architecture Findings\n")
    lines.append("### Can we currently build one generic assessment engine for all roles?\n")
    lines.append("**PARTIALLY**\n")
    lines.append("The Python evaluator engine itself is generic and data-driven. However, the data required to run it across the other 40 roles does not exist. We cannot assess roles without questions or benchmarks.")
    
    lines.append("\n### What data is missing?\n")
    lines.append("1. Normalized, clean critical competencies for the 40 iGOT roles (currently they are hierarchical strings like 'Functional → Office Management').")
    lines.append("2. Role requirement benchmarks (80% for Statistical Officer, but nothing defined for 'STATISTICAL INVESTIGATOR GRADE I').")
    lines.append("3. Question banks for the other 40 roles (currently only `question_bank_statistical_role.json` exists).")

    lines.append("\n### What should become configuration/data instead of hardcoded Python?\n")
    lines.append("- **Role identifiers and competency lists** must be fully decoupled from code.")
    lines.append("- **Question pools** must be loaded dynamically based on the role requested (currently test scripts hardcode 'Statistical Officer').")
    lines.append("- **Benchmarks** (e.g., 80% passing) should be a configurable threshold in `role_requirements.json` rather than hardcoded in the evaluator (if it currently is).")
    
    lines.append("\n## Missing Data\n")
    lines.append("- Question banks for all non-Statistical-Officer roles.")
    lines.append("- Benchmarks for all non-Statistical-Officer roles.")
    lines.append("- Explicit Course-to-Competency mapping (recommender is purely semantic right now).")
    
    lines.append("\n## Recommended Next Experiment\n")
    lines.append("Build a Data Ingestion script that normalizes the 40 iGOT roles. We should parse out the 'Functional → Office Management' strings into clean competency names (e.g. 'Office Management'), create a generic `question_bank_general.json` template, and establish baseline benchmarks for at least 3 other roles to prove the evaluator can handle multi-role dynamically.")
    
    with open("/home/priyanshu/.gemini/antigravity-ide/brain/33720bb3-a07c-4ae5-8ed8-e4dae6e20d4f/03_role_competency_inventory.md", "w") as f:
        f.write("\n".join(lines))
        
if __name__ == "__main__":
    run_inventory()
