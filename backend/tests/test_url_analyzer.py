import pytest
from app.ml.url_analyzer import analyze_url_risk

def test_ip_address_url():
    result = analyze_url_risk("http://192.168.1.100/apply-job")
    assert result["is_valid"] is True
    assert result["risk_score"] >= 45.0
    assert any(e["id"] == "RAW_IP_ADDRESS" for e in result["evidences"])
    assert result["ssrf_protection"] == "STRICT_PASSIVE_INSPECTION_ACTIVE"

def test_high_risk_tld():
    result = analyze_url_risk("https://careers-verify.xyz/submit")
    assert any(e["id"] == "HIGH_RISK_TLD" for e in result["evidences"])

def test_punycode_homograph():
    result = analyze_url_risk("https://xn--appl-4qa.com/login")
    assert any(e["id"] == "PUNYCODE_HOMOGRAPH" for e in result["evidences"])

def test_legitimate_url():
    result = analyze_url_risk("https://careers.google.com/jobs")
    assert result["risk_score"] < 25.0
    assert result["risk_level"] == "LOW"
