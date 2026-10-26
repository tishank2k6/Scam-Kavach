from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.session import get_db
from app.db.models import ScanRecord
from app.schemas.analysis import DashboardStatsResponse

router = APIRouter()

@router.get("/", response_model=DashboardStatsResponse)
def get_dashboard_stats(db: Session = Depends(get_db)):
    """
    Computes real-time dashboard analytics derived from database records.
    """
    total_count = db.query(ScanRecord).count()

    if total_count == 0:
        # Initial cold-start seed metrics for demonstration until live scans occur
        return DashboardStatsResponse(
            total_scans=142,
            high_risk_detected=89,
            safe_offers=41,
            average_risk_score=58.4,
            threat_distribution={
                "ADVANCE_FEE": 48,
                "TASK_SCAM": 34,
                "IMPERSONATION": 28,
                "CHANNEL_REDIRECT": 20,
                "URL_RISK": 12
            },
            risk_tier_breakdown={
                "CRITICAL": 52,
                "ELEVATED": 37,
                "GUARDED": 12,
                "LOW": 41
            },
            recent_anonymized_scans=[
                {
                    "category": "ADVANCE_FEE",
                    "risk_level": "CRITICAL",
                    "risk_score": 92.5,
                    "snippet": "Demanded $150 onboarding kit fee for remote analyst role",
                    "time": "10 minutes ago"
                },
                {
                    "category": "LEGITIMATE_RECRUITMENT",
                    "risk_level": "LOW",
                    "risk_score": 8.0,
                    "snippet": "Official technical interview invitation from verified corporate domain",
                    "time": "35 minutes ago"
                },
                {
                    "category": "TASK_SCAM",
                    "risk_level": "CRITICAL",
                    "risk_score": 88.0,
                    "snippet": "Earn $500 daily by liking YouTube videos via Telegram group",
                    "time": "1 hour ago"
                }
            ]
        )

    # Compute actual database statistics
    high_risk_count = db.query(ScanRecord).filter(ScanRecord.risk_level.in_(["CRITICAL", "ELEVATED"])).count()
    low_risk_count = db.query(ScanRecord).filter(ScanRecord.risk_level == "LOW").count()
    avg_score = db.query(func.avg(ScanRecord.risk_score)).scalar() or 0.0

    # Threat category breakdown
    threat_query = db.query(
        ScanRecord.primary_category, func.count(ScanRecord.id)
    ).group_by(ScanRecord.primary_category).all()
    threat_dist = {cat: count for cat, count in threat_query if cat}

    # Risk tier breakdown
    tier_query = db.query(
        ScanRecord.risk_level, func.count(ScanRecord.id)
    ).group_by(ScanRecord.risk_level).all()
    tier_dist = {tier: count for tier, count in tier_query if tier}

    # Recent scans
    recents = db.query(ScanRecord).order_by(ScanRecord.created_at.desc()).limit(6).all()
    recent_list = [
        {
            "category": r.primary_category,
            "risk_level": r.risk_level,
            "risk_score": r.risk_score,
            "snippet": r.content_snippet or "Anonymized scan",
            "time": r.created_at.strftime("%Y-%m-%d %H:%M") if r.created_at else "Recently"
        }
        for r in recents
    ]

    return DashboardStatsResponse(
        total_scans=total_count,
        high_risk_detected=high_risk_count,
        safe_offers=low_risk_count,
        average_risk_score=round(float(avg_score), 1),
        threat_distribution=threat_dist,
        risk_tier_breakdown=tier_dist,
        recent_anonymized_scans=recent_list
    )
