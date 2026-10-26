import logging
import sys
import re

SECRET_PATTERNS = [
    re.compile(r'(api[-_]?key\s*[:=]\s*)([\'"][^\'"]+[\'"]|[^\s,]+)', re.IGNORECASE),
    re.compile(r'(authorization\s*[:=]\s*Bearer\s+)([^\s,]+)', re.IGNORECASE),
    re.compile(r'(password\s*[:=]\s*)([\'"][^\'"]+[\'"]|[^\s,]+)', re.IGNORECASE),
]

class SecretScrubbingFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        msg = super().format(record)
        for pattern in SECRET_PATTERNS:
            msg = pattern.sub(r'\1[REDACTED_SECRET]', msg)
        return msg

def setup_logger(name: str = "scamshield") -> logging.Logger:
    logger = logging.getLogger(name)
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(SecretScrubbingFormatter(
            "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
        ))
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)
    return logger

logger = setup_logger()
