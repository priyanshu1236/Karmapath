from typing import List, Dict, Optional
from pydantic import BaseModel

class CompetencyDef(BaseModel):
    id: str
    name: str
    priority: int

class RoleProfile(BaseModel):
    role_id: str
    role_name: str
    domain: str
    critical_competencies: List[CompetencyDef]

class AssessmentMetadata(BaseModel):
    type: str = "Initial Assessment"
    version: str = "v1"
    question_count: int

class CompetencyResult(BaseModel):
    competency: str
    capability: float
    question_count: int

class DevelopmentGap(BaseModel):
    competency: str
    capability: float
    required: float
    gap: float
    status: str

class HighestPriorityGap(BaseModel):
    competency: str
    gap: float

class FinalAssessmentResult(BaseModel):
    role: str
    domain: str
    assessment: AssessmentMetadata
    role_capability_profile: List[CompetencyResult]
    development_gaps: List[DevelopmentGap]
    highest_priority_gap: Optional[HighestPriorityGap]
    recommendations: List["RecommendationCourse"] = []


class EvaluateRequest(BaseModel):
    employee_id: str
    assessment_id: str
    role: str
    domain: str
    answers: Dict[str, str]

class GenerateRequest(BaseModel):
    employee_id: str
    role: str
    domain: str

from typing import Union
from pydantic import Field

class RecommendationRequest(BaseModel):
    role: str = Field(..., min_length=1)
    development_gaps: List[Union[DevelopmentGap, str]]
    top_k: int = Field(default=5, ge=1, le=10)

class RecommendationCourse(BaseModel):
    course_id: str
    title: str
    provider: Optional[str] = None
    score: float
    semantic_score: float
    role_bonus: float
    gap_priority_score: float
    matched_competency: str
    gap: float
    reason: str
    metadata_source: Optional[str] = None

class RecommendationResponse(BaseModel):
    role: str
    recommendations: List[RecommendationCourse]
