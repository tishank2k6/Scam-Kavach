from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from app.db.session import get_db
from app.db.models import ScanRecord
from app.core.logging import logger

router = APIRouter()

@router.get("/")
def get_history(
    session_id: Optional[str] = Query(None, description="Optional guest session token"),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Retrieves user scan history. Filterable by guest session ID.
    """
    query = db.query(ScanRecord).filter(ScanRecord.is_ephemeral == False)
    if session_id:
        query = query.filter(ScanRecord.user_session_id == session_id)

    records = query.order_by(ScanRecord.created_at.desc()).limit(limit).all()

    return [
        {
            "id": r.id,
            "created_at": r.created_at.isoformat() if r.created_at else "",
            "scan_type": r.scan_type,
            "risk_score": r.risk_score,
            "risk_level": r.risk_level,
            "primary_category": r.primary_category,
            "content_snippet": r.content_snippet,
            "evidence_count": r.evidence_count,
            "analysis_summary": r.analysis_summary,
            "evidence_data": r.evidence_data,
            "recommended_steps": r.recommended_steps
        }
        for r in records
    ]

@router.delete("/{record_id}")
def delete_record(record_id: str, db: Session = Depends(get_db)):
    """
    Deletes an individual scan entry from persistent storage.
    """
    record = db.query(ScanRecord).filter(ScanRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Scan record not found.")

    db.delete(record)
    db.commit()
    logger.info(f"Deleted scan record: {record_id}")
    return {"message": "Record successfully deleted.", "id": record_id}

@router.delete("/")
def clear_all_history(
    session_id: Optional[str] = Query(None, description="Session ID to clear"),
    db: Session = Depends(get_db)
):
    """
    Purges scan history. If session_id provided, deletes only that session's records.
    """
    query = db.query(ScanRecord)
    if session_id:
        count = query.filter(ScanRecord.user_session_id == session_id).delete(synchronize_session=False)
    else:
        count = query.delete(synchronize_session=False)
    
    db.commit()
    logger.info(f"Purged {count} scan records.")
    return {"message": f"Successfully cleared {count} records."}
