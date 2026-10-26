import os
import joblib
from typing import Dict, Any, List
from app.core.logging import logger

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(CURRENT_DIR, "scam_model.joblib")

_model_cache = None

def get_model():
    global _model_cache
    if _model_cache is None:
        if os.path.exists(MODEL_PATH):
            try:
                _model_cache = joblib.load(MODEL_PATH)
                logger.info("Loaded calibrated ML scam classifier successfully.")
            except Exception as e:
                logger.error(f"Failed to load model from {MODEL_PATH}: {e}")
                _model_cache = None
        else:
            logger.warning(f"Model file not found at {MODEL_PATH}, will auto-train on startup.")
            try:
                from app.ml.train import train_and_evaluate
                _model_cache, _ = train_and_evaluate()
            except Exception as e:
                logger.error(f"Auto-training failed: {e}")
                _model_cache = None
    return _model_cache

def predict_scam_probability(text: str) -> Dict[str, Any]:
    """
    Evaluates text using the trained Calibrated Classifier.
    Returns:
        probability: float (0.0 to 1.0)
        confidence: float
        status: "MODEL_PREDICTION" or "FALLBACK"
    """
    model = get_model()
    if model is None:
        return {
            "probability": 0.5,
            "confidence": 0.0,
            "status": "FALLBACK_MODEL_UNAVAILABLE"
        }

    try:
        # predict_proba returns [prob_legitimate, prob_scam]
        proba = model.predict_proba([text])[0]
        prob_scam = float(proba[1])
        
        # Confidence is distance from 0.5 uncertainty threshold
        confidence = round(abs(prob_scam - 0.5) * 2.0, 2)

        return {
            "probability": round(prob_scam, 3),
            "confidence": confidence,
            "status": "CALIBRATED_ESTIMATE"
        }
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        return {
            "probability": 0.5,
            "confidence": 0.0,
            "status": f"ERROR: {str(e)}"
        }
