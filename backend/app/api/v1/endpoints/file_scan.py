import io
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.v1.endpoints.analyze import analyze_text
from app.schemas.analysis import TextAnalysisRequest, TextAnalysisResponse
from pypdf import PdfReader
from app.core.logging import logger

router = APIRouter()

@router.post("/offer-letter", response_model=TextAnalysisResponse)
async def scan_offer_letter_file(
    file: UploadFile = File(...),
    allow_storage: bool = Form(True),
    session_id: str = Form(None),
    db: Session = Depends(get_db)
):
    """
    Safely parses an uploaded Offer Letter (PDF or TXT) and executes forensic scam analysis.
    """
    filename = (file.filename or "").lower()
    content = await file.read()

    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds 10MB limit.")

    extracted_text = ""
    try:
        if filename.endswith(".pdf"):
            reader = PdfReader(io.BytesIO(content))
            extracted_pages = []
            for page in reader.pages[:10]:  # limit to first 10 pages
                t = page.extract_text()
                if t:
                    extracted_pages.append(t)
            extracted_text = "\n".join(extracted_pages).strip()
        else:
            # Plain text or Markdown
            extracted_text = content.decode("utf-8", errors="ignore").strip()
    except Exception as e:
        logger.error(f"Failed to extract document text: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to read document: {str(e)}")

    if len(extracted_text) < 15:
        raise HTTPException(
            status_code=400, 
            detail="Could not extract readable text from document. Ensure it is not an encrypted image-only scan."
        )

    # Reuse analyze_text pipeline
    payload = TextAnalysisRequest(
        text=extracted_text[:25000],
        allow_storage=allow_storage,
        session_id=session_id
    )

    return await analyze_text(payload, db)
