import uuid
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from app.db.session import get_db
from app.db.models import ReportedScam

router = APIRouter()

class ReportScamRequest(BaseModel):
    company_name: str
    scam_category: str
    description: str
    sender_contact: Optional[str] = None

INITIAL_REPORTS = [
    {
        "company_name": "Amazon Web Services (Impersonated)",
        "scam_category": "ADVANCE_FEE",
        "description": "Scammer sent an email from aws-career-hiring@gmail.com demanding ₹3,500 security deposit for laptop courier.",
        "sender_contact": "Telegram @aws_hr_desk",
        "upvotes": 48
    },
    {
        "company_name": "Google Maps Review Task",
        "scam_category": "TASK_SCAM",
        "description": "Approached on WhatsApp promising ₹500 per review. After 3 tasks, asked to deposit ₹2,000 for VIP task unlocking.",
        "sender_contact": "+91 98234-81923",
        "upvotes": 72
    },
    {
        "company_name": "TCS Fast-Track Placement Scheme",
        "scam_category": "PLACEMENT_GUARANTEE",
        "description": "WhatsApp group claiming to have direct HR contacts offering confirmed joining letters for ₹7,500 fee.",
        "sender_contact": "tcs-direct-placement.xyz",
        "upvotes": 35
    }
]

@router.get("/reports")
def get_community_reports(db: Session = Depends(get_db)):
    """
    Retrieves public registry of student-reported recruitment scams.
    """
    reports = db.query(ReportedScam).order_by(ReportedScam.upvotes.desc()).limit(20).all()
    if not reports:
        # Seed initial realistic reports
        for item in INITIAL_REPORTS:
            rep = ReportedScam(
                id=str(uuid.uuid4()),
                company_name=item["company_name"],
                scam_category=item["scam_category"],
                description=item["description"],
                sender_contact=item["sender_contact"],
                upvotes=item["upvotes"]
            )
            db.add(rep)
        db.commit()
        reports = db.query(ReportedScam).all()

    return [
        {
            "id": r.id,
            "company_name": r.company_name,
            "scam_category": r.scam_category,
            "description": r.description,
            "sender_contact": r.sender_contact,
            "status": r.status,
            "upvotes": r.upvotes,
            "created_at": r.created_at.strftime("%Y-%m-%d") if r.created_at else ""
        }
        for r in reports
    ]

@router.post("/report")
def report_new_scam(payload: ReportScamRequest, db: Session = Depends(get_db)):
    """
    Submits a new recruitment scam warning to the public ScamShield registry.
    """
    rep = ReportedScam(
        id=str(uuid.uuid4()),
        company_name=payload.company_name.strip(),
        scam_category=payload.scam_category.strip(),
        description=payload.description.strip(),
        sender_contact=payload.sender_contact.strip() if payload.sender_contact else None,
        upvotes=1
    )
    db.add(rep)
    db.commit()
    db.refresh(rep)

    return {
        "success": True,
        "message": "Thank you! Your report has been added to the public scam registry to protect fellow students.",
        "id": rep.id
    }

@router.post("/upvote/{report_id}")
def upvote_report(report_id: str, db: Session = Depends(get_db)):
    """
    Upvotes a scam report to increase its visibility.
    """
    rep = db.query(ReportedScam).filter(ReportedScam.id == report_id).first()
    if not rep:
        raise HTTPException(status_code=404, detail="Report not found.")
    rep.upvotes = (rep.upvotes or 0) + 1
    db.commit()
    return {"success": True, "upvotes": rep.upvotes}
