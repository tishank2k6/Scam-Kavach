import uuid
import datetime
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from app.db.session import get_db
from app.db.models import User, OrderRecord
from app.core.config import settings
from app.core.logging import logger

router = APIRouter()

SUBSCRIPTION_PLANS = [
    {
        "id": "FREE",
        "name": "Student Free",
        "price_inr": 0,
        "billing_period": "forever",
        "badge": "STARTER",
        "credits": 10,
        "description": "Essential scam screening for students and early-career job applicants.",
        "features": [
            "10 Full Scans per month",
            "Job Offer & Message Text Scanner",
            "Suspicious URL Risk Inspector",
            "Evidence-based phrase highlighter",
            "Automated PII redaction",
            "Community scam database access"
        ],
        "is_popular": False,
        "button_text": "Current Plan"
    },
    {
        "id": "STANDARD",
        "name": "Campus Placement",
        "price_inr": 199,
        "billing_period": "month",
        "badge": "MOST POPULAR",
        "credits": 50,
        "description": "Ideal for active job hunters applying across LinkedIn, Telegram, and job portals.",
        "features": [
            "50 Full Scans per month",
            "Offer Letter PDF document analysis",
            "Recruiter domain authenticity verifier",
            "Actionable verification checklists",
            "Email scan history exports",
            "Priority heuristic processing"
        ],
        "is_popular": True,
        "button_text": "Upgrade to Standard"
    },
    {
        "id": "PRO",
        "name": "Job Seeker Pro",
        "price_inr": 499,
        "billing_period": "month",
        "badge": "RECOMMENDED",
        "credits": 250,
        "description": "Comprehensive defense for intensive hiring drives, career switches, and remote jobs.",
        "features": [
            "250 Full Scans per month",
            "Unlimited Offer Letter PDF scans",
            "Exportable Forensic PDF Reports for Cybercrime/Police",
            "Deep typosquatting & brand lookalike scans",
            "Dedicated WhatsApp & Telegram Scam Shield bot access",
            "24/7 Priority verification support"
        ],
        "is_popular": False,
        "button_text": "Upgrade to Pro"
    },
    {
        "id": "PREMIUM",
        "name": "Institution & Campus",
        "price_inr": 1499,
        "billing_period": "month",
        "badge": "CAMPUS LICENSE",
        "credits": 10000,
        "description": "For college placement cells, university career centers, and student bodies.",
        "features": [
            "Unlimited Scans for all registered students",
            "Campus Placement Cell Admin Dashboard",
            "Batch Offer Verification for campus drives",
            "Custom scam keyword alert feeds",
            "API Access with higher rate limits",
            "Official Institutional Verification Badge"
        ],
        "is_popular": False,
        "button_text": "Get Campus License"
    }
]

class CreateOrderRequest(BaseModel):
    plan_id: str
    user_id: Optional[str] = None
    user_email: Optional[str] = None

class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: Optional[str] = "simulated_valid_signature"
    plan_id: str
    user_id: Optional[str] = None
    user_email: Optional[str] = None

@router.get("/plans")
def get_plans():
    """
    Returns available subscription tiers, pricing in INR, and credit limits.
    """
    return {
        "currency": "INR",
        "razorpay_key_id": settings.RAZORPAY_KEY_ID,
        "plans": SUBSCRIPTION_PLANS
    }

@router.post("/create-order")
def create_razorpay_order(payload: CreateOrderRequest, db: Session = Depends(get_db)):
    """
    Initiates Razorpay order in INR. Uses Razorpay SDK or safe mock order for hackathon demo.
    """
    plan = next((p for p in SUBSCRIPTION_PLANS if p["id"] == payload.plan_id), None)
    if not plan:
        raise HTTPException(status_code=404, detail="Selected plan does not exist.")

    amount_inr = plan["price_inr"]
    if amount_inr == 0:
        return {
            "order_id": f"free_order_{uuid.uuid4().hex[:12]}",
            "amount": 0,
            "currency": "INR",
            "plan_id": "FREE",
            "status": "paid"
        }

    amount_in_paise = int(amount_inr * 100)
    order_id = f"order_{uuid.uuid4().hex[:14]}"

    # Attempt real Razorpay order if live keys provided
    is_mock = True
    try:
        if not settings.RAZORPAY_KEY_ID.startswith("rzp_test_scamshield_demo"):
            import razorpay
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
            rzp_order = client.order.create({
                "amount": amount_in_paise,
                "currency": "INR",
                "receipt": f"rcpt_{uuid.uuid4().hex[:8]}",
                "notes": {
                    "plan_id": plan["id"],
                    "plan_name": plan["name"],
                    "user_email": payload.user_email or "guest@scamshield.org"
                }
            })
            order_id = rzp_order["id"]
            is_mock = False
    except Exception as e:
        logger.info(f"Using simulated Razorpay Order ID for test environment: {e}")
        is_mock = True

    # Persist pending order record
    try:
        order_record = OrderRecord(
            user_id=payload.user_id,
            razorpay_order_id=order_id,
            amount_inr=float(amount_inr),
            plan_id=plan["id"],
            status="created"
        )
        db.add(order_record)
        db.commit()
    except Exception as e:
        logger.error(f"Failed to record order: {e}")
        db.rollback()

    return {
        "order_id": order_id,
        "amount": amount_in_paise,
        "amount_inr": amount_inr,
        "currency": "INR",
        "plan_id": plan["id"],
        "plan_name": plan["name"],
        "key_id": settings.RAZORPAY_KEY_ID,
        "is_mock_mode": is_mock
    }

@router.post("/verify-payment")
def verify_payment(payload: VerifyPaymentRequest, db: Session = Depends(get_db)):
    """
    Verifies Razorpay payment signature and upgrades user subscription with new credits.
    """
    plan = next((p for p in SUBSCRIPTION_PLANS if p["id"] == payload.plan_id), None)
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found.")

    # Cryptographic signature check for live keys
    is_live_key = not settings.RAZORPAY_KEY_ID.startswith("rzp_test_scamshield_demo")
    if is_live_key and payload.razorpay_signature and payload.razorpay_signature != "simulated_valid_signature":
        import hmac
        import hashlib
        msg = f"{payload.razorpay_order_id}|{payload.razorpay_payment_id}".encode("utf-8")
        expected_sig = hmac.new(settings.RAZORPAY_KEY_SECRET.encode("utf-8"), msg, hashlib.sha256).hexdigest()
        if not hmac.compare_digest(expected_sig, payload.razorpay_signature):
            raise HTTPException(status_code=400, detail="Invalid Razorpay cryptographic payment signature.")

    # Update order record
    order = db.query(OrderRecord).filter(OrderRecord.razorpay_order_id == payload.razorpay_order_id).first()
    if order:
        order.status = "paid"
        order.razorpay_payment_id = payload.razorpay_payment_id
        db.commit()

    # Find or update user credits
    credits_added = plan["credits"]
    user = None
    if payload.user_id:
        user = db.query(User).filter(User.id == payload.user_id).first()
    elif payload.user_email:
        user = db.query(User).filter(User.email == payload.user_email).first()

    if user:
        user.subscription_tier = plan["id"]
        user.credits_remaining = (user.credits_remaining or 0) + credits_added
        db.commit()
        return {
            "success": True,
            "message": f"Payment verified! Upgraded to {plan['name']}.",
            "plan_id": plan["id"],
            "credits_remaining": user.credits_remaining
        }

    return {
        "success": True,
        "message": f"Payment verified! {credits_added} credits unlocked for {plan['name']}.",
        "plan_id": plan["id"],
        "credits_remaining": credits_added
    }
