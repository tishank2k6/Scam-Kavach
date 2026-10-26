import uuid
import datetime
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import ScanRecord
from app.schemas.analysis import (
    TextAnalysisRequest, 
    TextAnalysisResponse, 
    URLAnalysisRequest, 
    URLAnalysisResponse,
    EvidenceItem
)
from app.core.security import redact_pii, check_prompt_injection, generate_content_hash
from app.ml.heuristics import scan_heuristics, compute_heuristic_score
from app.ml.classifier import predict_scam_probability
from app.ml.url_analyzer import analyze_url_risk
from app.ml.llm_explainer import explain_findings
from app.core.logging import logger

router = APIRouter()

@router.post("/text", response_model=TextAnalysisResponse)
async def analyze_text(payload: TextAnalysisRequest, db: Session = Depends(get_db)):
    """
    Analyzes submitted job offer or recruitment message.
    Combines rule-based heuristics with calibrated TF-IDF ML classifier.
    """
    raw_text = payload.text.strip()
    if not raw_text:
        raise HTTPException(status_code=400, detail="Text payload cannot be empty.")

    # 1. Prompt Injection Inspection
    has_injection = check_prompt_injection(raw_text)

    # 2. PII Redaction
    redacted_text, pii_categories = redact_pii(raw_text)
    content_hash = generate_content_hash(raw_text)

    # 3. Rule-Based Heuristic Evaluation
    heuristic_evidences = scan_heuristics(raw_text)
    heuristic_score = compute_heuristic_score(heuristic_evidences)

    # 4. Baseline Calibrated ML Model Inference
    ml_result = predict_scam_probability(raw_text)
    ml_score = ml_result["probability"] * 100.0
    model_conf = ml_result["confidence"]

    # 5. Hybrid Calibrated Fusion Scoring
    # If explicit high-severity forensic triggers exist (e.g. upfront fee), give heuristics primary weight
    if heuristic_score >= 50.0:
        final_score = (0.65 * heuristic_score) + (0.35 * ml_score)
    elif heuristic_evidences:
        final_score = (0.50 * heuristic_score) + (0.50 * ml_score)
    else:
        final_score = (0.20 * heuristic_score) + (0.80 * ml_score)

    if has_injection:
        final_score = max(final_score, 75.0)
        heuristic_evidences.append({
            "rule_id": "PROMPT_INJECTION_DETECTED",
            "category": "SECURITY_EXPLOIT",
            "severity": "HIGH",
            "weight": 40.0,
            "matched_text": "System instruction override attempt",
            "start_char": 0,
            "end_char": min(50, len(raw_text)),
            "explanation": "Input contains hostile prompt injection phrases aimed at manipulating AI safety boundaries."
        })

    final_score = round(min(100.0, max(0.0, final_score)), 1)

    # Determine Calibrated Risk Tier
    if final_score >= 70.0:
        risk_level = "CRITICAL"
    elif final_score >= 45.0:
        risk_level = "ELEVATED"
    elif final_score >= 20.0:
        risk_level = "GUARDED"
    else:
        risk_level = "LOW"

    # Determine Primary Category
    if heuristic_evidences:
        primary_category = heuristic_evidences[0]["category"]
    elif final_score < 25.0:
        primary_category = "LEGITIMATE_RECRUITMENT"
    else:
        primary_category = "SUSPICIOUS_GENERAL"

    # 6. Explanations (LLM or Deterministic Engine)
    explanation = await explain_findings(
        analyzed_text=redacted_text,
        risk_score=final_score,
        risk_level=risk_level,
        evidences=heuristic_evidences,
        primary_category=primary_category
    )

    scan_id = str(uuid.uuid4())
    now_str = datetime.datetime.utcnow().isoformat()

    # 7. Privacy-Conscious Persistence
    if payload.allow_storage:
        try:
            # Store redacted snippet (first 280 chars) for privacy
            snippet = (redacted_text[:280] + "...") if len(redacted_text) > 280 else redacted_text
            record = ScanRecord(
                id=scan_id,
                scan_type="TEXT",
                risk_score=final_score,
                risk_level=risk_level,
                primary_category=primary_category,
                content_snippet=snippet,
                content_hash=content_hash,
                is_ephemeral=False,
                analysis_summary=explanation["summary"],
                evidence_count=len(heuristic_evidences),
                model_confidence=model_conf,
                user_session_id=payload.session_id,
                evidence_data=heuristic_evidences,
                recommended_steps=explanation["safe_next_steps"]
            )
            db.add(record)
            db.commit()
        except Exception as e:
            logger.error(f"Failed to persist scan record: {e}")
            db.rollback()

    evidence_items = [
        EvidenceItem(
            rule_id=e.get("rule_id", "GENERIC_SIGNAL"),
            category=e.get("category", "GENERAL"),
            severity=e.get("severity", "MEDIUM"),
            matched_text=e.get("matched_text", ""),
            start_char=e.get("start_char"),
            end_char=e.get("end_char"),
            explanation=e.get("explanation", "")
        )
        for e in heuristic_evidences
    ]

    return TextAnalysisResponse(
        id=scan_id,
        risk_score=final_score,
        risk_level=risk_level,
        primary_category=primary_category,
        ml_probability=round(ml_result["probability"], 3),
        model_confidence=model_conf,
        evidences=evidence_items,
        summary=explanation["summary"],
        safe_next_steps=explanation["safe_next_steps"],
        redacted_pii_categories=pii_categories,
        is_ephemeral=not payload.allow_storage,
        created_at=now_str
    )

@router.post("/url", response_model=URLAnalysisResponse)
async def analyze_url(payload: URLAnalysisRequest, db: Session = Depends(get_db)):
    """
    Performs passive structural analysis of a suspicious URL.
    SSRF-Safe: Never connects to or downloads from the target server.
    """
    raw_url = payload.url.strip()
    if not raw_url:
        raise HTTPException(status_code=400, detail="URL cannot be empty.")

    scan_result = analyze_url_risk(raw_url)
    scan_id = str(uuid.uuid4())
    now_str = datetime.datetime.utcnow().isoformat()

    if payload.allow_storage:
        try:
            record = ScanRecord(
                id=scan_id,
                scan_type="URL",
                risk_score=scan_result["risk_score"],
                risk_level=scan_result["risk_level"],
                primary_category="URL_ANALYSIS",
                content_snippet=scan_result["hostname"],
                content_hash=generate_content_hash(raw_url),
                is_ephemeral=False,
                analysis_summary=f"URL inspection of {scan_result['hostname']}. Level: {scan_result['risk_level']}",
                evidence_count=len(scan_result["evidences"]),
                model_confidence=1.0,
                user_session_id=payload.session_id,
                evidence_data=scan_result["evidences"],
                recommended_steps=scan_result["recommendations"]
            )
            db.add(record)
            db.commit()
        except Exception as e:
            logger.error(f"Failed to persist URL scan: {e}")
            db.rollback()

    return URLAnalysisResponse(
        id=scan_id,
        url=scan_result["url"],
        hostname=scan_result["hostname"],
        is_https=scan_result["is_https"],
        risk_score=scan_result["risk_score"],
        risk_level=scan_result["risk_level"],
        evidences=scan_result["evidences"],
        recommendations=scan_result["recommendations"],
        threat_intel_status=scan_result["threat_intel_status"],
        ssrf_protection=scan_result["ssrf_protection"],
        created_at=now_str
    )
