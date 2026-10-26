import uuid
import datetime
import hashlib
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
from app.db.session import get_db
from app.db.models import User
from app.core.config import settings

router = APIRouter()

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class GuestLoginRequest(BaseModel):
    guest_name: Optional[str] = "Student Guest"

def hash_password(password: str) -> str:
    return hashlib.sha256((password + settings.JWT_SECRET).encode()).hexdigest()

@router.post("/register")
def register_user(payload: RegisterRequest, db: Session = Depends(get_db)):
    """
    Registers a new student/job seeker account and grants 10 free initial scan credits.
    """
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Account with this email already exists.")

    user = User(
        id=str(uuid.uuid4()),
        name=payload.name,
        email=payload.email,
        password_hash=hash_password(payload.password),
        subscription_tier="FREE",
        credits_remaining=10
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "success": True,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "subscription_tier": user.subscription_tier,
            "credits_remaining": user.credits_remaining
        },
        "token": f"token_{user.id}"
    }

@router.post("/login")
def login_user(payload: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticates user and returns profile with current scan credits.
    """
    hashed = hash_password(payload.password)
    user = db.query(User).filter(User.email == payload.email, User.password_hash == hashed).first()
    if not user:
        # Check if email exists to give specific feedback or create demo account
        existing = db.query(User).filter(User.email == payload.email).first()
        if existing:
            raise HTTPException(status_code=401, detail="Invalid password.")
        # Auto-create demo student account on first login
        user = User(
            id=str(uuid.uuid4()),
            name=payload.email.split("@")[0].capitalize(),
            email=payload.email,
            password_hash=hashed,
            subscription_tier="FREE",
            credits_remaining=10
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return {
        "success": True,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "subscription_tier": user.subscription_tier,
            "credits_remaining": user.credits_remaining
        },
        "token": f"token_{user.id}"
    }

@router.post("/guest")
def create_guest_session(payload: GuestLoginRequest, db: Session = Depends(get_db)):
    """
    Creates an instant zero-friction guest student profile with 10 free credits.
    """
    guest_id = str(uuid.uuid4())
    guest_email = f"guest_{guest_id[:8]}@scamshield.local"
    user = User(
        id=guest_id,
        name=payload.guest_name or "Student Guest",
        email=guest_email,
        subscription_tier="FREE",
        credits_remaining=10
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "success": True,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "subscription_tier": user.subscription_tier,
            "credits_remaining": user.credits_remaining
        },
        "token": f"guest_{user.id}"
    }

@router.get("/me")
def get_current_user_profile(user_id: Optional[str] = None, db: Session = Depends(get_db)):
    """
    Retrieves current user profile and credit balance.
    """
    if not user_id:
        return {
            "name": "Guest Student",
            "subscription_tier": "FREE",
            "credits_remaining": 10
        }
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {
            "name": "Guest Student",
            "subscription_tier": "FREE",
            "credits_remaining": 10
        }
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "subscription_tier": user.subscription_tier,
        "credits_remaining": user.credits_remaining
    }
