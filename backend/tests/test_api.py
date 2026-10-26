import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/v1/health/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data

def test_analyze_scam_text():
    payload = {
        "text": "Congratulations! You are selected. Pay $100 registration fee for your onboarding laptop dispatch. Contact Telegram @hr_manager",
        "allow_storage": True,
        "session_id": "test-session-123"
    }
    response = client.post("/api/v1/analyze/text", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["risk_score"] > 60.0
    assert data["risk_level"] in ("ELEVATED", "CRITICAL")
    assert len(data["evidences"]) > 0
    assert len(data["safe_next_steps"]) > 0

def test_analyze_legitimate_text():
    payload = {
        "text": "Thank you for interviewing with our engineering team at Google. We are thrilled to offer you the Software Engineering Intern role.",
        "allow_storage": False
    }
    response = client.post("/api/v1/analyze/text", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["risk_level"] == "LOW"
    assert data["is_ephemeral"] is True

def test_analyze_url():
    payload = {
        "url": "http://192.168.1.1/apply-job.xyz",
        "allow_storage": True
    }
    response = client.post("/api/v1/analyze/url", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["risk_score"] > 50.0
    assert data["is_https"] is False

def test_dashboard_stats():
    response = client.get("/api/v1/dashboard/stats/")
    assert response.status_code == 200
    data = response.json()
    assert "total_scans" in data
    assert "risk_tier_breakdown" in data
