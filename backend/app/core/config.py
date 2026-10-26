import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8", 
        case_sensitive=False, 
        extra="ignore"
    )

    PROJECT_NAME: str = "Scam Kavach"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = False

    # Database: Defaults to local SQLite if POSTGRES_URL not set
    DATABASE_URL: str = Field(
        default="sqlite:///./scamshield.db",
        description="PostgreSQL or SQLite connection string"
    )

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ]

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    MAX_TEXT_LENGTH: int = 30000

    # Auth & JWT
    JWT_SECRET: str = "scamshield_super_secure_jwt_secret_key_2026"
    JWT_ALGORITHM: str = "HS256"

    # Razorpay Payment Gateway
    RAZORPAY_KEY_ID: str = "rzp_test_scamshield_demo"
    RAZORPAY_KEY_SECRET: str = "demo_secret_key_123"

    # Optional LLM Integration
    LLM_PROVIDER: str = "none"
    LLM_API_KEY: str = ""
    LLM_BASE_URL: str = ""
    LLM_MODEL: str = ""

    # Optional Threat Intelligence API
    SAFE_BROWSING_API_KEY: str = ""
    VIRUSTOTAL_API_KEY: str = ""

settings = Settings()
