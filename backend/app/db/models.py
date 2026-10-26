import datetime
import uuid
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, Text, JSON
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    password_hash = Column(String(255), nullable=True)  # nullable for guest / OAuth
    subscription_tier = Column(String(50), default="FREE")  # "FREE", "STANDARD", "PRO", "PREMIUM"
    credits_remaining = Column(Integer, default=10)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class OrderRecord(Base):
    __tablename__ = "order_records"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), index=True, nullable=True)
    razorpay_order_id = Column(String(100), unique=True, index=True, nullable=False)
    razorpay_payment_id = Column(String(100), nullable=True)
    amount_inr = Column(Float, nullable=False)
    plan_id = Column(String(50), nullable=False)
    status = Column(String(50), default="created")  # "created", "paid", "failed"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ReportedScam(Base):
    __tablename__ = "reported_scams"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    company_name = Column(String(150), nullable=False)
    scam_category = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    sender_contact = Column(String(150), nullable=True)
    status = Column(String(50), default="VERIFIED_COMMUNITY_WARNING")
    upvotes = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ScanRecord(Base):
    __tablename__ = "scan_records"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    scan_type = Column(String(20), nullable=False)  # "TEXT", "URL", or "FILE"
    risk_score = Column(Float, nullable=False)      # 0.0 to 100.0
    risk_level = Column(String(20), nullable=False)  # "LOW", "GUARDED", "ELEVATED", "CRITICAL"
    primary_category = Column(String(50), nullable=False)
    content_snippet = Column(String(300), nullable=True)  # Redacted preview
    content_hash = Column(String(64), index=True)
    is_ephemeral = Column(Boolean, default=False)
    analysis_summary = Column(Text, nullable=True)
    evidence_count = Column(Integer, default=0)
    model_confidence = Column(Float, default=0.0)
    user_session_id = Column(String(64), index=True, nullable=True)
    evidence_data = Column(JSON, nullable=True)
    recommended_steps = Column(JSON, nullable=True)
