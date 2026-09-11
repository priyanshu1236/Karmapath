import os
import json
import sys
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

import sys
import importlib.util
import types
from pathlib import Path

# Explicitly load AI modules from the actual directory using importlib
# to avoid 'app' namespace collisions when running from the backend/ directory.
AI_DIR = Path(__file__).resolve().parent.parent.parent / "ai" / "initial assisment"

def load_ai_module(module_name, rel_path):
    spec = importlib.util.spec_from_file_location(module_name, str(AI_DIR / rel_path))
    mod = importlib.util.module_from_spec(spec)
    sys.modules[module_name] = mod
    spec.loader.exec_module(mod)
    return mod

sys.modules["ai"] = types.ModuleType("ai")
sys.modules["ai.app"] = types.ModuleType("ai.app")
sys.modules["ai.app.assessment"] = types.ModuleType("ai.app.assessment")
sys.modules["ai.app.data"] = types.ModuleType("ai.app.data")
sys.modules["ai.app.recommender"] = types.ModuleType("ai.app.recommender")

models = load_ai_module("ai.app.assessment.models", "app/assessment/models.py")
GenerateRequest = models.GenerateRequest
EvaluateRequest = models.EvaluateRequest
RecommendationRequest = models.RecommendationRequest
RecommendationResponse = models.RecommendationResponse

catalog = load_ai_module("ai.app.data.catalog", "app/data/catalog.py")
evaluator = load_ai_module("ai.app.assessment.evaluator", "app/assessment/evaluator.py")
evaluate_assessment = evaluator.evaluate_assessment
_load_question_bank = evaluator._load_question_bank

baseline_match = load_ai_module("ai.app.recommender.baseline_match", "app/recommender/baseline_match.py")
get_recommendations = baseline_match.get_recommendations

llm_gen = load_ai_module("ai.app.assessment.llm_question_generator", "app/assessment/llm_question_generator.py")
generate_interest_questions = llm_gen.generate_interest_questions

app = FastAPI(title="SIH Assessment Bridge API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = AI_DIR / "data"
QBANK_PATH = str(DATA_DIR / "assessments" / "question_bank_statistical_role.json")
REQ_PATH = str(DATA_DIR / "assessments" / "role_requirements.json")
BLUEPRINTS_PATH = str(DATA_DIR / "assessments" / "assessment_blueprints.json")
ROLES_DIR = str(DATA_DIR / "roles")
COMPETENCY_REGISTRY_PATH = str(DATA_DIR / "competencies" / "competency_registry.json")
SCRATCH_DIR = AI_DIR / "scratch"
os.makedirs(SCRATCH_DIR, exist_ok=True)

@app.get("/api/assessment/generate")
def generate_assessment(role: str, domain: str, employee_id: str, area_of_interest: str = None):
    print("[GENERATE] role =", role)
    print("[GENERATE] domain =", domain)
    print("[GENERATE] area_of_interest =", area_of_interest)
    
    role_id = role.lower().replace(" ", "_")
    
    if role not in ["Statistical Officer", "College / University Faculty"]:
        return {
            "supported": False,
            "message": "An assessment for this role is not configured yet."
        }
    
    # Load blueprint
    if not os.path.exists(BLUEPRINTS_PATH):
        raise HTTPException(status_code=500, detail="Blueprints not found")
        
    with open(BLUEPRINTS_PATH, "r") as f:
        blueprints = json.load(f)
        
    blueprint = blueprints.get("initial_assessment", {}).get(role_id)
    if not blueprint:
        raise HTTPException(status_code=500, detail=f"No blueprint for {role}")
        
    qbank = _load_question_bank(QBANK_PATH)
    qbank_dict = {q["id"]: q for q in qbank}
    
    selected_questions = []
    
    # Validation and selection
    target_competencies = blueprint.get("competencies", {})
    if not target_competencies:
        raise HTTPException(status_code=500, detail="Blueprint has no competencies")
        
    selected_ids = set()
    
    for comp, q_ids in target_competencies.items():
        if len(q_ids) != 3:
            raise HTTPException(status_code=500, detail=f"Blueprint validation failed: {comp} does not have exactly 3 questions")
            
        for qid in q_ids:
            if qid in selected_ids:
                raise HTTPException(status_code=500, detail=f"Blueprint validation failed: Duplicate question ID {qid}")
            selected_ids.add(qid)
            
            if qid not in qbank_dict:
                raise HTTPException(status_code=500, detail=f"Blueprint validation failed: Question ID {qid} does not exist in bank")
                
            q = qbank_dict[qid]
            q_comp_id = q.get('competency_id', q.get('competency'))
            if q_comp_id != comp:
                raise HTTPException(status_code=500, detail=f"Blueprint validation failed: Question {qid} actual competency '{q.get('competency')}' does not match blueprint '{comp}'")
                
            selected_questions.append(q)
            
    if len(selected_questions) != 18:
        raise HTTPException(status_code=500, detail=f"Blueprint validation failed: Expected 18 questions, got {len(selected_questions)}")
        
    # Strip correct answers and explanations before sending to frontend
    clean_questions = []
    for q in selected_questions:
        clean_q = {
            "id": q["id"],
            "category": q.get("category", "General"),
            "competency": q.get("competency", ""),
            "skill": q.get("skill", ""),
            "difficulty": q.get("difficulty", "medium"),
            "marks": q.get("marks", 1),
            "question": q.get("question_text", q.get("question", "")),
            "options": q.get("options", {})
        }
        clean_questions.append(clean_q)
        
    # Handle Interest Questions
    interest_questions = []
    logger.info(f"=== INTEREST ASSESSMENT DEBUG ===")
    logger.info(f"role: {role}")
    logger.info(f"domain: {domain}")
    logger.info(f"area_of_interest: {area_of_interest}")
    logger.info(f"standard question count: {len(clean_questions)}")
    
    if area_of_interest:
        try:
            logger.info("LLM generator called: YES")
            generated = generate_interest_questions(role, area_of_interest)
            logger.info(f"LLM generated count: {len(generated)}")
            logger.info(f"validated count: {len(generated)}")

            if generated:
                # Save full generated questions with answers to a temp file
                temp_file = SCRATCH_DIR / f"{employee_id}_interest.json"
                with open(temp_file, "w") as f:
                    json.dump({"area_of_interest": area_of_interest, "questions": generated}, f)
                
                # Strip correct answers for frontend
                for q in generated:
                    clean_q = {
                        "id": q["id"],
                        "category": q.get("category", "Area of Interest"),
                        "competency": q.get("competency", ""),
                        "skill": q.get("skill", ""),
                        "difficulty": q.get("difficulty", "medium"),
                        "marks": q.get("marks", 1),
                        "question": q.get("question", ""),
                        "options": q.get("options", {})
                    }
                    interest_questions.append(clean_q)
        except Exception as e:
            logger.info("LLM generator called: YES (but failed)")
            logger.exception(f"Failed to generate interest questions: {e}")
            
    logger.info(f"final question count: {len(clean_questions) + len(interest_questions)}")
    logger.info(f"generated question IDs: {[q['id'] for q in interest_questions]}")
    logger.info(f"=================================")
    
    print("[GENERATE] standard questions:", len(clean_questions))
    print("[GENERATE] interest questions:", len(interest_questions))
    print("[GENERATE] final questions:", len(clean_questions) + len(interest_questions))
    print("[GENERATE] final IDs:", [q.get("id") for q in clean_questions + interest_questions])
            
    return {
        "supported": True,
        "assessment_id": "ASSESS-001",
        "questions": clean_questions + interest_questions,
        "area_of_interest": area_of_interest
    }

@app.post("/api/assessment/evaluate")
def evaluate(req: EvaluateRequest):
    if req.role not in ["Statistical Officer", "College / University Faculty"]:
        raise HTTPException(status_code=400, detail="Unsupported role")
        
    # Run deterministic evaluator
    try:
        # Separate standard answers and interest answers
        standard_answers = {k: v for k, v in req.answers.items() if not k.startswith("AI-GEN-")}
        interest_answers = {k: v for k, v in req.answers.items() if k.startswith("AI-GEN-")}
        
        result_dict = evaluate_assessment(standard_answers, req.role, req.domain, QBANK_PATH, BLUEPRINTS_PATH, REQ_PATH)
        
        # Evaluate interest questions if any
        if interest_answers:
            temp_file = SCRATCH_DIR / f"{req.employee_id}_interest.json"
            if os.path.exists(temp_file):
                with open(temp_file, "r") as f:
                    saved_interest = json.load(f)
                
                # Group by competency
                competency_stats = {}
                total_questions = len(saved_interest.get("questions", []))
                total_correct = 0

                for q in saved_interest.get("questions", []):
                    comp_name = q.get("competency")
                    if not comp_name:
                        comp_name = "Area of Interest"
                    
                    if comp_name not in competency_stats:
                        competency_stats[comp_name] = {"total": 0, "correct": 0}
                        
                    competency_stats[comp_name]["total"] += 1
                    
                    if interest_answers.get(q["id"]) == q.get("correct_answer"):
                        competency_stats[comp_name]["correct"] += 1
                        total_correct += 1

                overall_cap = round((total_correct / total_questions) * 100, 2) if total_questions > 0 else 0
                overall_req = 80
                overall_gap = max(0, overall_req - overall_cap)
                overall_status = "COMPETENT"
                if overall_gap > 25:
                    overall_status = "HIGH PRIORITY"
                elif overall_gap > 10:
                    overall_status = "PRIORITY"
                elif overall_gap > 0:
                    overall_status = "DEVELOPING"
                    
                competencies_list = []
                for comp, stats in competency_stats.items():
                    cap = round((stats["correct"] / stats["total"]) * 100, 2)
                    required_score = 80
                    gap = max(0, required_score - cap)
                    status = "COMPETENT"
                    if gap > 25:
                        status = "HIGH PRIORITY"
                    elif gap > 10:
                        status = "PRIORITY"
                    elif gap > 0:
                        status = "DEVELOPING"
                        
                    competencies_list.append({
                        "competency": comp,
                        "capability": cap,
                        "required": required_score,
                        "gap": gap,
                        "status": status
                    })
                    
                    # Add to main development gaps if gap > 0 for recommender integration
                    if gap > 0:
                        if "development_gaps" not in result_dict:
                            result_dict["development_gaps"] = []
                        result_dict["development_gaps"].append({
                            "competency": comp,
                            "capability": cap,
                            "required": required_score,
                            "gap": gap,
                            "status": status,
                            "source": "area_of_interest"
                        })
                
                result_dict["interest_assessment"] = {
                    "area_of_interest": saved_interest.get("area_of_interest", "Area of Interest"),
                    "question_count": total_questions,
                    "correct_count": total_correct,
                    "capability": overall_cap,
                    "required": overall_req,
                    "gap": overall_gap,
                    "status": overall_status,
                    "competencies": competencies_list
                }

        try:
            gaps = result_dict.get("development_gaps", [])
            if gaps:
                recs = get_recommendations(req.role, gaps, top_k=5)
                result_dict["recommendations"] = recs
            else:
                result_dict["recommendations"] = []
        except Exception as e:
            logger.exception("Recommendation failed during assessment evaluation")
            result_dict["recommendations"] = []
            
        return result_dict
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

import logging
logger = logging.getLogger(__name__)

@app.post("/api/recommendations", response_model=RecommendationResponse)
def recommendations(req: RecommendationRequest):
    try:
        if not req.development_gaps:
            return RecommendationResponse(role=req.role, recommendations=[])
            
        # Convert Pydantic models to dicts if needed for get_recommendations
        gaps = []
        for gap in req.development_gaps:
            if isinstance(gap, str):
                gaps.append(gap)
            else:
                # gap is a DevelopmentGap object
                gaps.append(gap.model_dump())
                
        recs = get_recommendations(req.role, gaps, req.top_k)
        
        return RecommendationResponse(role=req.role, recommendations=recs)
    except Exception as e:
        logger.exception("Error in /api/recommendations")
        raise HTTPException(status_code=500, detail="Recommendation engine/catalog failure")

from fastapi import UploadFile, File, Form
from app.resource_store import save_pdf, save_resource, list_resources
quiz_generator = load_ai_module("ai.app.rag.quiz_generator", "app/rag/quiz_generator.py")
generate_quiz_from_pdf = quiz_generator.generate_quiz_from_pdf

@app.post("/api/resources")
async def create_resource(
    file: UploadFile = File(...),
    title: str = Form(...),
    role: str = Form(""),
    domain: str = Form(""),
    competency_id: str = Form(""),
    competency: str = Form("")
):
    try:
        # Validate file
        if not file.filename.endswith(".pdf"):
            raise HTTPException(status_code=400, detail="File must be a PDF")
            
        file_bytes = await file.read()
        if not file_bytes:
            raise HTTPException(status_code=400, detail="File is empty")
            
        # Save raw PDF and get ID
        pdf_info = save_pdf(file_bytes, file.filename)
        resource_id = pdf_info["resource_id"]
        
        # Build metadata
        metadata = {
            "resource_id": resource_id,
            "filename": file.filename,
            "title": title,
            "role": role,
            "domain": domain,
            "competency_id": competency_id,
            "competency": competency,
            "status": "processing"
        }
        
        # Generate quiz
        try:
            quiz_result = generate_quiz_from_pdf(pdf_info["file_path"], metadata)
            questions = quiz_result.get("questions", [])
            
            if not questions:
                logger.error("Quiz generation returned no valid questions after parsing.")
                raise ValueError("Quiz generation returned no valid questions after parsing.")
                
            metadata["question_count"] = len(questions)
            metadata["status"] = "ready"
            
            # Store resource and quiz
            save_resource(resource_id, metadata, questions)
            
            return {
                "success": True,
                "resource": metadata
            }
            
        except Exception as e:
            logger.exception("Failed to generate quiz")
            metadata["status"] = "failed"
            metadata["error"] = str(e)
            save_resource(resource_id, metadata, [])
            raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Resource upload failed")
        raise HTTPException(status_code=500, detail="Internal server error")

from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class EvaluateResourceRequest(BaseModel):
    employee_id: str
    answers: dict[str, str]
    existing_capability: Optional[float] = None

from app.resource_store import get_resource

HISTORY_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data", "history")

@app.get("/api/resources/available")
def get_available_resources(employee_id: Optional[str] = None):
    resources = list_resources()
    ready_resources = [r for r in resources if r.get("status") == "ready"]
    
    if employee_id:
        emp_history_dir = os.path.join(HISTORY_DIR, employee_id)
        if os.path.exists(emp_history_dir):
            for r in ready_resources:
                h_path = os.path.join(emp_history_dir, f"{r['resource_id']}.json")
                if os.path.exists(h_path):
                    try:
                        with open(h_path, "r") as f:
                            r["history"] = json.load(f)
                    except Exception:
                        pass
                        
    return {"success": True, "resources": ready_resources}

@app.get("/api/resources/{resource_id}/quiz")
def get_resource_quiz(resource_id: str):
    metadata, questions = get_resource(resource_id)
    if not metadata or not questions:
        raise HTTPException(status_code=404, detail="Resource not found")
        
    if metadata.get("status") != "ready":
        raise HTTPException(status_code=400, detail="Resource is not ready")
        
    # Sanitize questions (remove correct_answer)
    sanitized_questions = []
    for q in questions:
        clean_q = {k: v for k, v in q.items() if k != "correct_answer"}
        sanitized_questions.append(clean_q)
        
    return {
        "success": True,
        "resource": metadata,
        "questions": sanitized_questions
    }

@app.post("/api/resources/{resource_id}/evaluate")
def evaluate_resource(resource_id: str, req: EvaluateResourceRequest):
    metadata, questions = get_resource(resource_id)
    if not metadata or not questions:
        raise HTTPException(status_code=404, detail="Resource not found")
        
    total = len(questions)
    if total == 0:
        raise HTTPException(status_code=400, detail="Resource has no questions")
        
    correct = 0
    incorrect = 0
    unanswered = 0
    
    for q in questions:
        q_id = q["id"]
        submitted = req.answers.get(q_id)
        if not submitted:
            unanswered += 1
        elif submitted == q.get("correct_answer"):
            correct += 1
        else:
            incorrect += 1
            
    score = correct
    percentage = round((correct / total) * 100, 2) if total > 0 else 0
    
    competency = metadata.get("competency", "").strip()
    competency_id = metadata.get("competency_id", "").strip()
    
    gap_update = {"applied": False, "reason": "resource_not_mapped_to_valid_competency"}
    
    if competency and competency_id and competency != "RESOURCE":
        if req.existing_capability is not None:
            updated_cap = (req.existing_capability + percentage) / 2
        else:
            updated_cap = percentage
            
        gap = max(0, 80 - updated_cap)
        status = "COMPETENT"
        if gap > 25:
            status = "HIGH PRIORITY"
        elif gap > 10:
            status = "PRIORITY"
        elif gap > 0:
            status = "DEVELOPING"
            
        gap_update = {
            "applied": True,
            "source": "resource_assessment",
            "competency": competency,
            "competency_id": competency_id,
            "new_capability": round(updated_cap, 2),
            "new_gap": round(gap, 2),
            "new_status": status
        }
        
    # Save history
    emp_history_dir = os.path.join(HISTORY_DIR, req.employee_id)
    os.makedirs(emp_history_dir, exist_ok=True)
    history_file = os.path.join(emp_history_dir, f"{resource_id}.json")
    
    history_entry = {
        "employee_id": req.employee_id,
        "resource_id": resource_id,
        "score": score,
        "total": total,
        "percentage": percentage,
        "correct": correct,
        "incorrect": incorrect,
        "unanswered": unanswered,
        "timestamp": datetime.now().isoformat()
    }
    
    try:
        with open(history_file, "w") as f:
            json.dump(history_entry, f, indent=2)
    except Exception as e:
        logger.error(f"Failed to save resource history: {e}")
        
    return {
        "success": True,
        "resource_id": resource_id,
        "score": score,
        "total": total,
        "percentage": percentage,
        "correct": correct,
        "incorrect": incorrect,
        "unanswered": unanswered,
        "competency": competency,
        "competency_id": competency_id,
        "gap_update": gap_update
    }

@app.get("/api/resources")
def get_resources():
    return {"success": True, "resources": list_resources()}

@app.get("/api/admin/resource-dashboard")
def admin_resource_dashboard(role: Optional[str] = None):
    resources = list_resources()
    if role and role != "All Roles":
        resources = [r for r in resources if r.get("role") == role]
        
    valid_resource_ids = set(r.get("resource_id") for r in resources)
    resource_role_map = {r.get("resource_id"): r.get("role", "General") for r in resources}
            
    all_histories = []
    unique_assessed_employees = set()
    employee_inferred_roles = {}
    total_employees_system = 0
    
    if os.path.exists(HISTORY_DIR):
        for emp_id in os.listdir(HISTORY_DIR):
            emp_dir = os.path.join(HISTORY_DIR, emp_id)
            if os.path.isdir(emp_dir):
                total_employees_system += 1
                has_assessment = False
                emp_role = "General"
                
                for h_file in os.listdir(emp_dir):
                    if h_file.endswith(".json"):
                        try:
                            with open(os.path.join(emp_dir, h_file), "r") as f:
                                hist = json.load(f)
                                r_id = hist.get("resource_id")
                                if r_id in valid_resource_ids:
                                    all_histories.append(hist)
                                    has_assessment = True
                                    
                                    # Infer employee role from resource
                                    r_role = resource_role_map.get(r_id, "General")
                                    if r_role and r_role != "General":
                                        emp_role = r_role
                        except Exception:
                            pass
                            
                employee_inferred_roles[emp_id] = emp_role
                if has_assessment:
                    unique_assessed_employees.add(emp_id)

    all_histories.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
    
    total_resources = len(resources)
    total_assessments = len(all_histories)
    employees_assessed = len(unique_assessed_employees)
    
    avg_score = 0
    if total_assessments > 0:
        avg_score = round(sum([h.get("percentage", 0) for h in all_histories]) / total_assessments, 1)

    res_performance = []
    needs_attention = []
    comp_agg = {}

    for r in resources:
        r_id = r.get("resource_id")
        r_role = r.get("role", "General")
        
        if not r_role or r_role.strip() == "" or r_role == "General":
            eligible_employees = total_employees_system
            r_role = "General"
        else:
            # Only count employees mapped to this role
            eligible_employees = sum(1 for emp, erole in employee_inferred_roles.items() if erole == r_role)
            
        r_hists = [h for h in all_histories if h.get("resource_id") == r_id]
        
        r_unique_employees = set(h.get("employee_id") for h in r_hists if h.get("employee_id"))
        attempted_count = len(r_unique_employees)
        not_attempted = max(0, eligible_employees - attempted_count)
        completed_count = attempted_count
        
        participation_rate = round((attempted_count / eligible_employees) * 100, 1) if eligible_employees > 0 else 0
        completion_rate = participation_rate
        
        total_r_attempts = len(r_hists)
        
        r_avg = 0
        if total_r_attempts > 0:
            r_avg = round(sum([h.get("percentage", 0) for h in r_hists]) / total_r_attempts, 1)
            
        r_status = "Good"
        if attempted_count > 0 and r_avg < 60:
            r_status = "Needs Attention"
            
        res_perf = {
            "resource_id": r_id,
            "title": r.get("title", r.get("filename", "Unknown Resource")),
            "role": r_role,
            "competency": r.get("competency", "Unspecified"),
            "question_count": r.get("question_count", 0),
            "eligible_employees": eligible_employees,
            "attempted_count": attempted_count,
            "completed_count": completed_count,
            "not_attempted": not_attempted,
            "participation_rate": participation_rate,
            "completion_rate": completion_rate,
            "total_attempts": total_r_attempts,
            "average_score": r_avg,
            "status": r_status
        }
        res_performance.append(res_perf)
        
        if r_status == "Needs Attention":
            needs_attention.append(res_perf)
            
        comp = r.get("competency", "Unspecified")
        if comp not in comp_agg:
            comp_agg[comp] = {"competency": comp, "resources": 0, "total_attempts": 0, "unique_employees": set(), "total_score": 0}
            
        comp_agg[comp]["resources"] += 1
        comp_agg[comp]["total_attempts"] += total_r_attempts
        comp_agg[comp]["unique_employees"].update(r_unique_employees)
        comp_agg[comp]["total_score"] += sum([h.get("percentage", 0) for h in r_hists])

    comp_performance = []
    for comp, data in comp_agg.items():
        c_total_attempts = data["total_attempts"]
        c_unique = len(data["unique_employees"])
        c_avg = round(data["total_score"] / c_total_attempts, 1) if c_total_attempts > 0 else 0
        c_status = "Good"
        if c_unique > 0 and c_avg < 60:
            c_status = "Needs Attention"
            
        comp_performance.append({
            "competency": comp,
            "resources": data["resources"],
            "unique_employees_assessed": c_unique,
            "total_attempts": c_total_attempts,
            "average_score": c_avg,
            "status": c_status
        })

    recent_activity = []
    r_map = {r.get("resource_id"): r for r in resources}
    for h in all_histories[:10]:
        r = r_map.get(h.get("resource_id"), {})
        recent_activity.append({
            "employee_id": h.get("employee_id", "Unknown"),
            "resource_id": h.get("resource_id"),
            "resource_title": r.get("title", r.get("filename", "Unknown Resource")),
            "competency": r.get("competency", "Unspecified"),
            "score": h.get("percentage", 0),
            "date": h.get("timestamp", "")
        })

    return {
        "success": True,
        "kpis": {
            "total_employees": total_employees_system,
            "employees_assessed": employees_assessed,
            "uploaded_resources": total_resources,
            "total_assessments": total_assessments,
            "average_score": avg_score
        },
        "resource_performance": res_performance,
        "competency_performance": comp_performance,
        "needs_attention": needs_attention,
        "recent_activity": recent_activity
    }

@app.get("/api/admin/department-dashboard")
def department_dashboard():
    departments_mapping = [
        {"name": "Higher Education", "role": "College / University Faculty"},
        {"name": "Economics & Statistics", "role": "Statistical Officer"},
        {"name": "General Administration", "role": "General"}
    ]
    
    pop_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data", "employee_population.json")
    role_population = {}
    if os.path.exists(pop_path):
        try:
            with open(pop_path, "r") as f:
                pop_data = json.load(f)
                role_population = pop_data.get("roles", {})
        except Exception:
            pass

    departments = []
    total_system_employees = 0
    total_assessed = 0
    
    for dept in departments_mapping:
        role = dept["role"]
        emp_count = role_population.get(role, 0)
        
        data = admin_resource_dashboard(role=role)
        comp_perf = data.get("competency_performance", [])
        
        sorted_comps = sorted(comp_perf, key=lambda x: x["average_score"], reverse=True)
        top_strengths = sorted_comps[:3]
        top_needs = sorted_comps[-3:] if len(sorted_comps) > 3 else sorted_comps
        
        assessed_count = data.get("kpis", {}).get("employees_assessed", 0)
        training_score = data.get("kpis", {}).get("average_score", 0)
        
        dept_info = {
            "name": dept["name"],
            "role": role,
            "employees": emp_count,
            "assessed": assessed_count,
            "participation": 0,
            "avg_capability": None,
            "training_score": training_score,
            "top_strengths": top_strengths,
            "top_needs": top_needs,
            "resource_performance": data.get("resource_performance", [])
        }
        
        if emp_count > 0:
            dept_info["participation"] = round((assessed_count / emp_count) * 100, 1)
            
        status = "On Track"
        if training_score < 60:
            status = "Priority"
        elif training_score < 80:
            status = "Monitor"
            
        dept_info["status"] = status
            
        departments.append(dept_info)
        
        total_system_employees += emp_count
        total_assessed += assessed_count
        
    overall_participation = round((total_assessed / total_system_employees) * 100, 1) if total_system_employees > 0 else 0
        
    return {
        "success": True,
        "kpis": {
            "total_departments": len(departments_mapping),
            "total_employees": total_system_employees,
            "training_participation": overall_participation,
            "avg_capability": None
        },
        "departments": departments
    }

