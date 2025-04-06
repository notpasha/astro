from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from enum import Enum

from app.db.base import get_db
from app.schemas.user import User
from app.services.user import update_subscription
from app.api.auth import get_current_verified_user
from app.models.user import SubscriptionTier

router = APIRouter(prefix="/subscriptions", tags=["subscriptions"])

class PaymentMethod(str, Enum):
    PAYPAL = "paypal"
    STRIPE = "stripe"
    CRYPTO = "crypto"

class SubscriptionPlan(BaseModel):
    tier: SubscriptionTier
    name: str
    price: float
    duration: int  # months
    features: List[str]

class PaymentRequest(BaseModel):
    tier: SubscriptionTier
    payment_method: PaymentMethod
    duration: int = 1  # months

# Mock subscription plans
SUBSCRIPTION_PLANS = [
    SubscriptionPlan(
        tier=SubscriptionTier.FREE,
        name="Free Plan",
        price=0.0,
        duration=0,
        features=[
            "10 chats per month",
            "Basic astrological insights",
            "Text-based readings"
        ]
    ),
    SubscriptionPlan(
        tier=SubscriptionTier.BASIC,
        name="Basic Plan",
        price=9.99,
        duration=1,
        features=[
            "Unlimited chats",
            "Detailed astrological insights",
            "Save and export readings",
            "Email support"
        ]
    ),
    SubscriptionPlan(
        tier=SubscriptionTier.PREMIUM,
        name="Premium Plan",
        price=19.99,
        duration=1,
        features=[
            "All Basic Plan features",
            "Advanced astrological charts",
            "Personalized monthly forecasts",
            "Birth chart analysis",
            "Priority support"
        ]
    ),
    SubscriptionPlan(
        tier=SubscriptionTier.PROFESSIONAL,
        name="Professional Plan",
        price=49.99,
        duration=1,
        features=[
            "All Premium Plan features",
            "Comprehensive compatibility reports",
            "Career and finance forecasts",
            "Personalized life path guidance",
            "24/7 priority support"
        ]
    )
]

@router.get("/plans", response_model=List[SubscriptionPlan])
def get_subscription_plans():
    """Get all available subscription plans"""
    return SUBSCRIPTION_PLANS

@router.post("/subscribe")
async def subscribe(
    payment: PaymentRequest,
    current_user: User = Depends(get_current_verified_user),
    db: Session = Depends(get_db)
):
    """Process subscription payment and update user subscription"""
    
    # In a real app, we would process payment here
    # For now, just mock the payment process
    
    if payment.tier == SubscriptionTier.FREE:
        return {"message": "You are already on the free plan"}
    
    # This would be replaced with actual payment processing
    payment_success = True
    
    if not payment_success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment processing failed"
        )
    
    # Update user subscription
    update_subscription(
        db, 
        user_id=current_user.id, 
        tier=payment.tier,
        months=payment.duration
    )
    
    return {
        "message": f"Successfully subscribed to {payment.tier.value} plan for {payment.duration} month(s)",
        "payment_method": payment.payment_method
    }