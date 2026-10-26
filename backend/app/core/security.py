import re
import hashlib
from typing import Tuple, List

# Regex patterns for sensitive PII
EMAIL_REGEX = re.compile(r'([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)', re.IGNORECASE)
PHONE_REGEX = re.compile(r'(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}\b')
CREDIT_CARD_REGEX = re.compile(r'\b(?:\d{4}[-\s]?){3}\d{4}\b')
SSN_REGEX = re.compile(r'\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b')
BANK_ACCOUNT_REGEX = re.compile(r'\b(?:account\s*(?:no|number|#)?\s*[:=]?\s*)(\d{8,18})\b', re.IGNORECASE)
OTP_REGEX = re.compile(r'\b(?:otp|one-time password|code)\s*(?:is|:)?\s*(\d{4,8})\b', re.IGNORECASE)

# Prompt injection heuristic triggers
PROMPT_INJECTION_PATTERNS = [
    re.compile(r'ignore\s+(?:all\s+)?previous\s+(?:instructions|prompts|rules)', re.IGNORECASE),
    re.compile(r'system\s+override', re.IGNORECASE),
    re.compile(r'you\s+are\s+now\s+(?:an?\s+)?unrestricted', re.IGNORECASE),
    re.compile(r'jailbreak', re.IGNORECASE),
    re.compile(r'disregard\s+(?:the\s+)?above', re.IGNORECASE),
    re.compile(r'roleplay\s+as\s+an\s+AI\s+with\s+no\s+safety\s+guidelines', re.IGNORECASE),
]

def redact_pii(text: str) -> Tuple[str, List[str]]:
    """
    Redacts personal identifying information from text before persistence.
    Returns the redacted text and a list of redacted categories.
    """
    redacted_categories = []
    processed = text

    if EMAIL_REGEX.search(processed):
        redacted_categories.append("EMAIL")
        processed = EMAIL_REGEX.sub(r'[REDACTED_EMAIL]', processed)

    if PHONE_REGEX.search(processed):
        redacted_categories.append("PHONE")
        processed = PHONE_REGEX.sub(r'[REDACTED_PHONE]', processed)

    if CREDIT_CARD_REGEX.search(processed):
        redacted_categories.append("PAYMENT_CARD")
        processed = CREDIT_CARD_REGEX.sub(r'[REDACTED_CARD]', processed)

    if SSN_REGEX.search(processed):
        redacted_categories.append("GOVERNMENT_ID")
        processed = SSN_REGEX.sub(r'[REDACTED_ID]', processed)

    if BANK_ACCOUNT_REGEX.search(processed):
        redacted_categories.append("BANK_ACCOUNT")
        processed = BANK_ACCOUNT_REGEX.sub(r'account: [REDACTED_ACCOUNT]', processed)

    if OTP_REGEX.search(processed):
        redacted_categories.append("OTP")
        processed = OTP_REGEX.sub(r'code [REDACTED_OTP]', processed)

    return processed, list(set(redacted_categories))

def check_prompt_injection(text: str) -> bool:
    """
    Checks if untrusted input contains prompt injection or jailbreak attempts.
    """
    for pattern in PROMPT_INJECTION_PATTERNS:
        if pattern.search(text):
            return True
    return False

def generate_content_hash(text: str) -> str:
    """
    Computes SHA-256 hash of text for deduplication and telemetry without storing raw text.
    """
    return hashlib.sha256(text.strip().encode("utf-8")).hexdigest()
