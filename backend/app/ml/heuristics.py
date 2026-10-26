import re
from typing import List, Dict, Any

# Heuristic Rule Definitions with exact regex patterns and educational explanations
RULES: List[Dict[str, Any]] = [
    # 1. Advance Fee & Equipment Scams
    {
        "id": "ADVANCE_FEE_LAPTOP",
        "category": "ADVANCE_FEE",
        "severity": "HIGH",
        "weight": 35.0,
        "pattern": re.compile(
            r'\b(?:pay|send|transfer|deposit|fee|charge)\s*(?:\$|£|€|rs\.?|inr)?\s*\d+\s*(?:for|towards)?\s*(?:the|your|a|an)?\s*(?:laptop|macbook|equipment|home\s*office|workstation|onboarding|courier|dispatch)',
            re.IGNORECASE
        ),
        "explanation": "Legitimate employers never demand upfront payment from candidates for laptops, onboarding kits, or equipment delivery."
    },
    {
        "id": "ADVANCE_FEE_REGISTRATION",
        "category": "ADVANCE_FEE",
        "severity": "HIGH",
        "weight": 30.0,
        "pattern": re.compile(
            r'\b(?:refundable|nominal|mandatory)?\s*(?:registration|training|verification|security|documentation|processing|portal)\s*(?:fee|deposit|charge|amount)\b',
            re.IGNORECASE
        ),
        "explanation": "Requesting a 'registration', 'verification', or 'refundable deposit' fee before or during hiring is a classic recruitment scam hallmark."
    },
    {
        "id": "CHECK_DEPOSIT_EQUIPMENT",
        "category": "ADVANCE_FEE",
        "severity": "HIGH",
        "weight": 40.0,
        "pattern": re.compile(
            r'\b(?:mail|send|email)\s*(?:you\s*)?(?:a\s*)?(?:cashier\'?s?\s*check|cheque|direct\s*deposit)\s*(?:to|for)\s*(?:buy|purchase|vendor)',
            re.IGNORECASE
        ),
        "explanation": "Counterfeit check scam: The scammer sends a fake check, asks you to deposit it and wire funds to their 'approved vendor' before the check bounces."
    },

    # 2. Channel Redirection & Untraceable Chat Apps
    {
        "id": "CHANNEL_REDIRECT_TELEGRAM",
        "category": "CHANNEL_REDIRECT",
        "severity": "HIGH",
        "weight": 25.0,
        "pattern": re.compile(
            r'\b(?:telegram|t\.me/[\w_]+|@[\w_]+(?:\s*on\s*telegram)?)\b|\b(?:contact|message|add|reach|join|connect|chat)\b.*?\b(?:telegram|t\.me/)\b',
            re.IGNORECASE
        ),
        "explanation": "Directing candidates to Telegram allows scammers to communicate anonymously without verified corporate email trails."
    },
    {
        "id": "CHANNEL_REDIRECT_WHATSAPP",
        "category": "CHANNEL_REDIRECT",
        "severity": "MEDIUM",
        "weight": 20.0,
        "pattern": re.compile(
            r'\b(?:contact|whatsapp\s*(?:me|us|hr)|send\s*resume\s*to\s*whatsapp|\+?\d{10,12}\s*on\s*whatsapp)\b',
            re.IGNORECASE
        ),
        "explanation": "Unsolicited job offers pushing recruitment exclusively via WhatsApp rather than standard ATS or corporate email."
    },
    {
        "id": "CHANNEL_REDIRECT_SIGNAL_WIRE",
        "category": "CHANNEL_REDIRECT",
        "severity": "HIGH",
        "weight": 25.0,
        "pattern": re.compile(
            r'\b(?:download|interview\s*on|add\s*us\s*on)\s*(?:signal|wire\s*app|skype\s*chat|google\s*chat\s*hangout)\b',
            re.IGNORECASE
        ),
        "explanation": "Conducting hiring interviews solely via non-corporate chat messengers is typical of identity theft and task scams."
    },

    # 3. Unrealistic Salary / Task Scams
    {
        "id": "TASK_SCAM_YOUTUBE_REVIEW",
        "category": "TASK_SCAM",
        "severity": "HIGH",
        "weight": 35.0,
        "pattern": re.compile(
            r'\b(?:like|subscribe|rate|watch|review)\s*(?:youtube\s*videos?|hotels?|products?|apps?)\s*(?:to\s*earn|for\s*daily\s*income|\$\d{2,4}|rs\.?\s*\d{3,5})\b',
            re.IGNORECASE
        ),
        "explanation": "Task/Prepaid Order Scam: Promises quick daily money for liking videos or rating products, leading to demands for 'prepaid investment' tasks."
    },
    {
        "id": "UNREALISTIC_PAY_EASY_WORK",
        "category": "UNREALISTIC_OFFER",
        "severity": "MEDIUM",
        "weight": 20.0,
        "pattern": re.compile(
            r'\b(?:earn|salary|make)\s*(?:\$\s*|rs\.?\s*|\binr\s*)[1-9]\d{2,4}\s*(?:per|a)?\s*(?:day|hour|daily)\s*(?:with\s*no\s*experience|working\s*from\s*home\s*1-2\s*hours?|just\s*using\s*your\s*phone)',
            re.IGNORECASE
        ),
        "explanation": "Disproportionately high pay for minimal hours or unskilled tasks is used as bait to trap students and job seekers."
    },

    # 4. Impersonation & Free Webmail Domains
    {
        "id": "FREE_MAIL_RECRUITER",
        "category": "IMPERSONATION",
        "severity": "HIGH",
        "weight": 30.0,
        "pattern": re.compile(
            r'\b(?:google|microsoft|amazon|apple|meta|netflix|tcs|infosys|wipro|deloitte|accenture|ibm)\s*(?:recruiter|hr|talent|careers)?\b.*?\b[a-zA-Z0-9._%+-]+@(?:gmail|yahoo|hotmail|outlook|protonmail|aol)\.com\b',
            re.IGNORECASE | re.DOTALL
        ),
        "explanation": "Major Fortune 500 tech firms and MNCs communicate via authenticated corporate domains (e.g. @google.com), never free Gmail or Yahoo accounts."
    },

    # 5. Coercive Urgency & Immediate Hiring
    {
        "id": "URGENCY_LIMITED_TIME",
        "category": "URGENCY",
        "severity": "MEDIUM",
        "weight": 15.0,
        "pattern": re.compile(
            r'\b(?:offer\s*expires\s*(?:in|within)\s*(?:24|12|2|48)\s*hours?|immediate\s*offer\s*confirmation|limited\s*(?:slots?|seats?)\s*left|reply\s*within\s*\d+\s*minutes?)\b',
            re.IGNORECASE
        ),
        "explanation": "Artificial urgency is engineered to create panic, inducing candidates to accept and transfer money before verifying the offer."
    },
    {
        "id": "NO_INTERVIEW_JOB_OFFER",
        "category": "UNREALISTIC_OFFER",
        "severity": "HIGH",
        "weight": 25.0,
        "pattern": re.compile(
            r'\b(?:selected\s*without\s*interview|direct\s*selection|congratulations\s*you\s*are\s*hired\s*without|no\s*interview\s*needed)\b',
            re.IGNORECASE
        ),
        "explanation": "Legitimate professional employers always conduct behavioral or technical assessments before extending employment offers."
    },

    # 6. Sensitive Data / Identity Harvesting
    {
        "id": "SENSITIVE_DATA_BEFORE_INTERVIEW",
        "category": "SENSITIVE_DATA",
        "severity": "HIGH",
        "weight": 30.0,
        "pattern": re.compile(
            r'\b(?:send\s*(?:us\s*)?(?:your\s*)?(?:bank\s*details|routing\s*number|credit\s*card|ssn|social\s*security|passport\s*copy|aadhaar|otp|netbanking\s*password))\b',
            re.IGNORECASE
        ),
        "explanation": "Demanding banking credentials, SSN/Aadhaar numbers, or identity documents before interview stages indicates identity theft risk."
    },

    # 7. Placement Guarantee Schemes
    {
        "id": "PLACEMENT_GUARANTEE_FEE",
        "category": "ADVANCE_FEE",
        "severity": "HIGH",
        "weight": 30.0,
        "pattern": re.compile(
            r'\b(?:100%\s*job\s*guarantee|assured\s*placement|pay\s*after\s*selection\s*booking\s*fee|placement\s*tie-up\s*fee)\b',
            re.IGNORECASE
        ),
        "explanation": "Guaranteed job schemes that require advance 'placement booking fees' violate ethical recruitment standards."
    }
]

def scan_heuristics(text: str) -> List[Dict[str, Any]]:
    """
    Executes all heuristic checks against input text.
    Extracts matched text, exact start/end character offsets, severity, and rule explanations.
    """
    evidences: List[Dict[str, Any]] = []

    for rule in RULES:
        for match in rule["pattern"].finditer(text):
            start, end = match.span()
            matched_snippet = text[start:end]
            
            # Avoid duplicate matches on same span
            is_dup = any(e["start_char"] == start and e["end_char"] == end for e in evidences)
            if not is_dup:
                evidences.append({
                    "rule_id": rule["id"],
                    "category": rule["category"],
                    "severity": rule["severity"],
                    "weight": rule["weight"],
                    "matched_text": matched_snippet,
                    "start_char": start,
                    "end_char": end,
                    "explanation": rule["explanation"]
                })

    return evidences

def compute_heuristic_score(evidences: List[Dict[str, Any]]) -> float:
    """
    Calculates a calibrated aggregate heuristic risk score from 0.0 to 100.0.
    Diminishing returns formula prevents score explosion while penalizing multiple high-severity signals.
    """
    if not evidences:
        return 0.0

    raw_sum = sum(e["weight"] for e in evidences)
    
    # Non-linear asymptotic scaling: 100 * (1 - e^(-raw_sum / 55))
    # E.g., single HIGH rule (35) -> ~47
    # Two HIGH rules (70) -> ~72
    # Three HIGH rules (100+) -> ~85 - 95
    import math
    scaled_score = 100.0 * (1.0 - math.exp(-raw_sum / 55.0))
    return round(min(100.0, max(0.0, scaled_score)), 1)
