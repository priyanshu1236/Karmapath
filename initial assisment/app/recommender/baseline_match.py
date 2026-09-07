import sys
from pathlib import Path
from sentence_transformers import SentenceTransformer, util

# Add the ai package to sys.path so we can import catalog
# Depending on where the script is run from, this ensures it works locally
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent))

try:
    from ai.app.data.catalog import get_all_courses, get_courses_for_role, get_role
except ImportError:
    # Fallback in case of module execution
    from app.data.catalog import get_all_courses, get_courses_for_role, get_role

# Scoring Constants
ROLE_BONUS = 0.10
GAP_WEIGHT = 0.10

# Load model globally to avoid reloading on each call, but load lazily
_model = None

def _get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer('all-MiniLM-L6-v2')
    return _model

def _construct_course_text(course: dict) -> str:
    parts = []
    if title := course.get("title"):
        parts.append(f"Course title: {title}")
    if provider := course.get("provider"):
        parts.append(f"Provider: {provider}")
    
    ls = course.get("learning_structure", {})
    if isinstance(ls, dict):
        if outcomes := ls.get("learning_outcomes"):
            parts.append(f"Learning outcomes: {outcomes}")
        if modules := ls.get("modules"):
            if isinstance(modules, list):
                mod_titles = [m.get("name", "") for m in modules if isinstance(m, dict)]
                if mod_titles:
                    parts.append(f"Modules: {', '.join(mod_titles)}")
            else:
                parts.append(f"Modules: {modules}")
    
    return "\n".join(parts)

def _normalize_gaps(development_gaps: list) -> list[dict]:
    normalized = []
    for gap in development_gaps:
        if isinstance(gap, str):
            normalized.append({"competency": gap, "gap": 0.0})
        elif isinstance(gap, dict) and "competency" in gap:
            normalized.append({
                "competency": gap["competency"],
                "gap": float(gap.get("gap", 0.0))
            })
    return normalized

def get_recommendations(role_name: str, development_gaps: list, top_k: int = 5) -> list[dict]:
    """
    Generate dynamic course recommendations based on role, gaps, and course metadata.
    """
    gaps = _normalize_gaps(development_gaps)
    if not gaps:
        return []

    # Get explicitly mapped courses for the role
    role_course_list = get_courses_for_role(role_name)
    role_course_ids = {c.get("course_id") for c in role_course_list if c.get("course_id")}

    all_courses = get_all_courses()
    if not all_courses:
        return []

    # Build gap queries
    queries = []
    for g in gaps:
        q_text = f"Role: {role_name}\nDevelopment competency: {g['competency']}"
        queries.append(q_text)

    # Encode gap queries
    model = _get_model()
    query_embeddings = model.encode(queries)

    # Build course texts and their indices
    valid_courses = []
    course_texts = []
    for c in all_courses:
        c_id = c.get("course_id")
        if not c_id:
            continue
        c_text = _construct_course_text(c)
        if not c_text.strip():
            continue
        valid_courses.append(c)
        course_texts.append(c_text)

    if not valid_courses:
        return []

    # Encode courses
    course_embeddings = model.encode(course_texts)

    results = []
    # Calculate similarities
    for c_idx, c in enumerate(valid_courses):
        c_id = c.get("course_id")
        c_emb = course_embeddings[c_idx]

        best_score = -1.0
        best_gap_idx = -1
        best_semantic_score = 0.0

        for q_idx, q_emb in enumerate(query_embeddings):
            # Compute cosine similarity (util.cos_sim returns 2D tensor)
            sim = util.cos_sim(q_emb, c_emb).item()
            gap_data = gaps[q_idx]
            
            role_bonus = ROLE_BONUS if c_id in role_course_ids else 0.0
            gap_priority_score = gap_data["gap"] * GAP_WEIGHT
            
            final_score = sim + role_bonus + gap_priority_score
            
            if final_score > best_score:
                best_score = final_score
                best_gap_idx = q_idx
                best_semantic_score = sim
                
        if best_gap_idx != -1:
            matched_gap = gaps[best_gap_idx]
            role_bonus_applied = ROLE_BONUS if c_id in role_course_ids else 0.0
            gap_priority_score_applied = matched_gap["gap"] * GAP_WEIGHT
            
            reason = f"Recommended to address your {matched_gap['competency']} development gap."
            if role_bonus_applied > 0:
                reason = f"Recommended because this course strongly matches your {matched_gap['competency']} gap and is explicitly associated with your role."

            result_dict = {
                "course_id": c_id,
                "title": c.get("title", ""),
                "score": round(best_score, 4),
                "semantic_score": round(best_semantic_score, 4),
                "role_bonus": role_bonus_applied,
                "gap_priority_score": round(gap_priority_score_applied, 4),
                "matched_competency": matched_gap["competency"],
                "gap": matched_gap["gap"],
                "reason": reason
            }
            if provider := c.get("provider"):
                result_dict["provider"] = provider
            if metadata_source := c.get("metadata_source"):
                result_dict["metadata_source"] = metadata_source

            results.append(result_dict)

    # Sort descending by final score
    results.sort(key=lambda x: x["score"], reverse=True)
    
    return results[:top_k]

if __name__ == "__main__":
    # Small test CLI for backward compatibility and manual execution
    print("Loading recommender and matching dynamically...\n")
    
    role = "Statistical Officer"
    sample_gaps = [
        {
            "competency": "Survey Design",
            "capability": 0.35,
            "required": 0.75,
            "gap": 0.40,
            "status": "PRIORITY"
        },
        {
            "competency": "Data Quality",
            "capability": 0.45,
            "required": 0.75,
            "gap": 0.30,
            "status": "DEVELOPMENT"
        }
    ]
    
    recs = get_recommendations(role, sample_gaps, top_k=3)
    
    for r in recs:
        print(f"[{r['score']:.2f}] {r['title']} (Gap: {r['matched_competency']})")
        print(f"       -> Semantic: {r['semantic_score']:.2f}, Role Bonus: {r['role_bonus']:.2f}, Priority: {r['gap_priority_score']:.2f}")
        print(f"       -> {r['reason']}")
        print()