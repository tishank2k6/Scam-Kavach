from fastapi import APIRouter
from app.core.config import settings
from app.ml.classifier import get_model

router = APIRouter()

@router.get("/")
def health_check():
    """
    Service liveness and readiness probe.
    """
    model = get_model()
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "ml_model_loaded": model is not None,
        "llm_provider": settings.LLM_PROVIDER,
        "environment": settings.ENVIRONMENT
    }
