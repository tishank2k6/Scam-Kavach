import re
from urllib.parse import urlparse, parse_qs
from typing import Dict, Any, List
import ipaddress

# Suspicious / high-abuse top-level domains commonly used in mass phishing & fake recruitment
HIGH_RISK_TLDS = {
    "xyz", "top", "click", "buzz", "work", "cam", "club", "country",
    "gq", "cf", "ml", "tk", "ga", "fit", "rest", "surf", "live", "vip"
}

# Known URL shorteners that obscure real destinations
URL_SHORTENERS = {
    "bit.ly", "tinyurl.com", "t.co", "rb.gy", "cutt.ly", "is.gd", 
    "ow.ly", "rebrand.ly", "shorte.st", "adf.ly"
}

# Common brand lookalike / typosquatting targets in recruitment phishing
SUSPICIOUS_BRAND_TOKENS = [
    r'goog1e', r'amaz0n', r'micros0ft', r'linkdin', r'paypa1',
    r'tcs[-_]?careers', r'infosys[-_]?jobs', r'deloitte[-_]?hr',
    r'apple[-_]?id', r'meta[-_]?jobs', r'netflix[-_]?talent'
]

SUSPICIOUS_PATH_KEYWORDS = [
    "verify", "login", "signin", "auth", "confirm-identity",
    "banking", "secure-account", "webscr", "kyc", "otp", "wire-transfer"
]

def analyze_url_risk(target_url: str, safe_browsing_key: str = "") -> Dict[str, Any]:
    """
    Performs safe, passive forensic inspection of target_url.
    Guarantees: NEVER performs network connections to target_url (Zero SSRF risk).
    """
    clean_url = target_url.strip()
    if not clean_url.startswith(("http://", "https://")):
        clean_url = "https://" + clean_url

    evidences: List[Dict[str, Any]] = []
    risk_score = 0.0

    try:
        parsed = urlparse(clean_url)
    except Exception as e:
        return {
            "url": target_url,
            "is_valid": False,
            "risk_score": 90.0,
            "risk_level": "CRITICAL",
            "evidences": [{"id": "MALFORMED_URL", "severity": "HIGH", "detail": f"Failed to parse URL: {str(e)}"}],
            "recommendations": ["Do not attempt to open this malformed address."],
            "is_https": False
        }

    hostname = (parsed.hostname or "").lower()
    port = parsed.port
    path = parsed.path.lower()
    query = parsed.query.lower()

    # 1. Protocol Safety Check
    is_https = parsed.scheme.lower() == "https"
    if not is_https:
        risk_score += 25.0
        evidences.append({
            "id": "UNENCRYPTED_HTTP",
            "severity": "MEDIUM",
            "category": "TRANSPORT_SECURITY",
            "detail": "URL uses unencrypted HTTP instead of HTTPS. Traffic can be intercepted.",
            "caveat": "Note: Even if HTTPS is present, it only encrypts transit and does NOT guarantee legitimacy."
        })

    # 2. IP Hostname Check (e.g., http://192.168.1.1/apply)
    is_ip = False
    try:
        ipaddress.ip_address(hostname)
        is_ip = True
        risk_score += 45.0
        evidences.append({
            "id": "RAW_IP_ADDRESS",
            "severity": "HIGH",
            "category": "ANONYMOUS_HOST",
            "detail": f"Hostname '{hostname}' is a direct IP address rather than a registered corporate domain name."
        })
    except ValueError:
        pass

    # 3. Punycode / IDN Homograph Check (e.g. xn--...)
    if hostname.startswith("xn--") or ".xn--" in hostname:
        risk_score += 35.0
        evidences.append({
            "id": "PUNYCODE_HOMOGRAPH",
            "severity": "HIGH",
            "category": "DOMAIN_DECEPTION",
            "detail": "Domain uses Punycode/IDN encoding, commonly used to spoof lookalike characters."
        })

    # 4. High-risk or Abuse TLD Check
    parts = hostname.split(".")
    tld = parts[-1] if len(parts) > 1 else ""
    if tld in HIGH_RISK_TLDS:
        risk_score += 30.0
        evidences.append({
            "id": "HIGH_RISK_TLD",
            "severity": "HIGH",
            "category": "ABUSE_REGISTRAR",
            "detail": f"Top-level domain '.{tld}' has a statistically high correlation with disposable spam/phishing campaigns."
        })

    # 5. Excessive Subdomain Nesting
    if len(parts) > 4 and not is_ip:
        risk_score += 20.0
        evidences.append({
            "id": "DEEP_SUBDOMAIN_NESTING",
            "severity": "MEDIUM",
            "category": "STRUCTURAL_ANOMALY",
            "detail": f"URL contains {len(parts)} domain segments. Scammers use multi-level subdomains to simulate authentic URLs."
        })

    # 6. Known URL Shortener
    if hostname in URL_SHORTENERS:
        risk_score += 25.0
        evidences.append({
            "id": "URL_SHORTENER_OBSCURITY",
            "severity": "MEDIUM",
            "category": "DESTINATION_OBSCURITY",
            "detail": f"Domain '{hostname}' is an anonymity shortener that hides the ultimate destination."
        })

    # 7. Brand Spoofing / Typosquatting in Domain
    for brand_regex in SUSPICIOUS_BRAND_TOKENS:
        if re.search(brand_regex, hostname):
            risk_score += 45.0
            evidences.append({
                "id": "BRAND_TYPOSQUATTING",
                "severity": "HIGH",
                "category": "IMPERSONATION",
                "detail": f"Domain '{hostname}' mimics a prominent brand with slight character mutations or hyphenation."
            })
            break

    # 8. Phishing Keywords in Path / Query
    matched_paths = [kw for kw in SUSPICIOUS_PATH_KEYWORDS if kw in path or kw in query]
    if matched_paths:
        risk_score += 20.0
        evidences.append({
            "id": "CREDENTIAL_HARVESTING_PATH",
            "severity": "MEDIUM",
            "category": "PATH_HEURISTIC",
            "detail": f"Path/query contains sensitive credential or payment triggers: {', '.join(matched_paths)}."
        })

    # 9. Non-Standard Port
    if port and port not in (80, 443, 8080):
        risk_score += 20.0
        evidences.append({
            "id": "NON_STANDARD_PORT",
            "severity": "MEDIUM",
            "category": "PORT_ANOMALY",
            "detail": f"URL targets unusual port :{port} instead of standard web ports."
        })

    # Final Risk Normalization
    final_score = min(100.0, max(0.0, risk_score))
    if final_score >= 70.0:
        risk_level = "CRITICAL"
    elif final_score >= 40.0:
        risk_level = "ELEVATED"
    elif final_score >= 15.0:
        risk_level = "GUARDED"
    else:
        risk_level = "LOW"

    # Actionable verification recommendations
    recommendations = []
    if final_score > 30:
        recommendations.append("Do NOT submit login credentials, CVs, or banking details on this webpage.")
        recommendations.append("Search the company's official domain via an independent search engine or careers portal.")
    if hostname in URL_SHORTENERS:
        recommendations.append("Use a secure URL expander to inspect the target address before visiting.")
    if not is_https:
        recommendations.append("Never submit passwords or forms over plain HTTP.")
    if not recommendations:
        recommendations.append("URL structural heuristics reveal no immediate red flags. Always verify job postings on official career portals.")

    return {
        "url": target_url,
        "hostname": hostname,
        "is_valid": True,
        "is_https": is_https,
        "risk_score": round(final_score, 1),
        "risk_level": risk_level,
        "evidences": evidences,
        "recommendations": recommendations,
        "threat_intel_status": "UNCONFIGURED_OR_UNLISTED",
        "ssrf_protection": "STRICT_PASSIVE_INSPECTION_ACTIVE"
    }
