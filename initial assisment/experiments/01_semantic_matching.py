import sys
import json
import platform
import torch
import sentence_transformers
from pathlib import Path
from sentence_transformers import SentenceTransformer, util

# Add the ai package to sys.path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.data.catalog import get_all_courses

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

def print_env():
    print("## Environment\n")
    print(f"Python: {platform.python_version()}")
    print(f"sentence-transformers: {sentence_transformers.__version__}")
    print(f"PyTorch: {torch.__version__}")
    cuda_avail = torch.cuda.is_available()
    print(f"CUDA: {'Available' if cuda_avail else 'Not Available'}")
    if cuda_avail:
        print(f"GPU: {torch.cuda.get_device_name(0)}")
    else:
        print("GPU: None")
    print("Model: all-MiniLM-L6-v2")
    print()

def run_experiment():
    print_env()
    
    model = SentenceTransformer('all-MiniLM-L6-v2')
    all_courses = get_all_courses()
    
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
        
    print("## Course Count\n")
    print(f"Courses evaluated: {len(valid_courses)}\n")
    
    course_embeddings = model.encode(course_texts)
    
    def evaluate_queries(queries, top_k):
        for q in queries:
            print(f"==================================================")
            print(f"QUERY: {q}")
            print(f"==================================================")
            print()
            print("Rank  Score   Course")
            print()
            
            q_emb = model.encode([q])[0]
            scores = []
            for i, c_emb in enumerate(course_embeddings):
                sim = util.cos_sim(q_emb, c_emb).item()
                scores.append((sim, valid_courses[i]['title']))
                
            scores.sort(key=lambda x: x[0], reverse=True)
            
            for rank, (score, title) in enumerate(scores[:top_k], 1):
                print(f"{rank:<5} {score:.4f}  {title}")
            print()

    # FIRST TEST
    print("## Results (Top 10 for competencies)\n")
    competencies = [
        "Agricultural Statistics",
        "Survey Design",
        "Sampling",
        "Data Quality",
        "GIS",
        "Python / Data Analysis"
    ]
    evaluate_queries(competencies, 10)
    
    # SECOND TEST
    print("## Natural Language Results\n")
    nl_queries = [
        "Need training in survey design for agricultural statistics",
        "Need training in GIS for statistical field data analysis",
        "Need training in Python for statistical data analysis"
    ]
    evaluate_queries(nl_queries, 10)
    
    # THIRD TEST
    print("## Wording Comparison\n")
    wording_queries = [
        "Survey Design",
        "Designing statistical surveys",
        "Planning and designing sample surveys",
        "Sampling",
        "Statistical sampling methods",
        "Selecting representative samples for surveys",
        "GIS",
        "Geographic Information Systems",
        "Spatial data analysis and mapping"
    ]
    evaluate_queries(wording_queries, 5)

if __name__ == "__main__":
    run_experiment()
