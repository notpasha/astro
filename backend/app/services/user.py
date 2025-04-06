from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException
import datetime

from app.models.user import User, Chat, Message, SubscriptionTier, AuthProvider
from app.schemas.user import UserCreate
from app.core.security import get_password_hash, verify_password

def get_user(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()

def get_user_by_provider_id(db: Session, provider: AuthProvider, provider_user_id: str) -> Optional[User]:
    return db.query(User).filter(User.auth_provider == provider, User.provider_user_id == provider_user_id).first()

def create_user(db: Session, user_in: UserCreate) -> User:
    user = get_user_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    
    db_user = User(
        email=user_in.email,
        username=user_in.username or user_in.email.split('@')[0],
        hashed_password=get_password_hash(user_in.password),
        auth_provider=AuthProvider.EMAIL
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_social_user(db: Session, email: str, username: str, auth_provider: AuthProvider, provider_user_id: str) -> User:
    user = get_user_by_email(db, email=email)
    if user:
        # Update provider info if user exists
        user.auth_provider = auth_provider
        user.provider_user_id = provider_user_id
        db.commit()
        db.refresh(user)
        return user
    
    db_user = User(
        email=email,
        username=username,
        is_verified=True,
        auth_provider=auth_provider,
        provider_user_id=provider_user_id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    user = get_user_by_email(db, email=email)
    if not user or not user.hashed_password:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

def verify_user_email(db: Session, user_id: int) -> User:
    user = get_user(db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_verified = True
    db.commit()
    db.refresh(user)
    return user

def update_subscription(db: Session, user_id: int, tier: SubscriptionTier, months: int = 1) -> User:
    user = get_user(db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.subscription_tier = tier
    
    if user.subscription_expiry and user.subscription_expiry > datetime.datetime.utcnow():
        user.subscription_expiry = user.subscription_expiry + datetime.timedelta(days=30*months)
    else:
        user.subscription_expiry = datetime.datetime.utcnow() + datetime.timedelta(days=30*months)
        
    db.commit()
    db.refresh(user)
    return user