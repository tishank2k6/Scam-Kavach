import pytest
from app.ml.heuristics import scan_heuristics, compute_heuristic_score

def test_advance_fee_detection():
    sample = "You are selected for our internship! Please pay $150 for your laptop and workstation delivery."
    evidences = scan_heuristics(sample)
    assert len(evidences) >= 1
    categories = [e["category"] for e in evidences]
    assert "ADVANCE_FEE" in categories
    assert evidences[0]["start_char"] is not None
    assert evidences[0]["end_char"] is not None

def test_telegram_redirect_detection():
    sample = "Join our recruitment team on Telegram @amazon_hr_official to complete the test."
    evidences = scan_heuristics(sample)
    assert any(e["category"] == "CHANNEL_REDIRECT" for e in evidences)

def test_legitimate_text_low_score():
    sample = "We are pleased to invite you to our university campus presentation for software engineer positions."
    evidences = scan_heuristics(sample)
    score = compute_heuristic_score(evidences)
    assert score == 0.0 or score < 20.0
