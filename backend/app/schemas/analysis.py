from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class TextAnalysisRequest(BaseModel):
    text: str = Field(..., min_length=5, max_length=30000, description="Pasted message, email, or offer text")
    allow_storage: bool = Field(default=True, description="Consent to retain anonymized scan record for personal history")
    session_id: Optional[str] = Field(default=None, description="Client session identifier for personal history grouping")

class URLAnalysisRequest(BaseModel):
    url: str = Field(..., min_length=3, max_length=2048, description="Target job portal, form, or recruiter URL")
    allow_storage: bool = Field(default=True, description="Consent to retain scan record")
    session_id: Optional[str] = Field(default=None, description="Client session identifier")

class EvidenceItem(BaseModel):
    rule_id: str
    category: str
    severity: str
    matched_text: str
    start_char: Optional[int] = None
    end_char: Optional[int] = None
    explanation: str

class TextAnalysisResponse(BaseModel):
    id: str
    risk_score: float
    risk_level: str
    primary_category: str
    ml_probability: float
    model_confidence: float
    evidences: List[EvidenceItem]
    summary: str
    safe_next_steps: List[str]
    redacted_pii_categories: List[str]
    is_ephemeral: bool
    created_at: str

class URLAnalysisResponse(BaseModel):
    id: str
    url: str
    hostname: str
    is_https: bool
    risk_score: float
    risk_level: str
    evidences: List[Dict[str, Any]]
    recommendations: List[str]
    threat_intel_status: str
    ssrf_protection: str
    created_at: str

class DashboardStatsResponse(BaseModel):
    total_scans: int
    high_risk_detected: int
    safe_offers: int
    average_risk_score: float
    threat_distribution: Dict[str, int]
    risk_tier_breakdown: Dict[str, int]
    recent_anonymized_scans: List[Dict[str, Any]]
