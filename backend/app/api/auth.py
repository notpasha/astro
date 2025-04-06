from fastapi import APIRouter, Depends, HTTPException, status, Body, BackgroundTasks, Query
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from datetime import timedelta
from jose import jwt, JWTError
from pydantic import EmailStr

from app.db.base import get_db
from app.schemas.user import UserCreate, Token, User, SocialLogin
from app.services.user import create_user, authenticate_user, get_user, verify_user_email, get_user_by_email, create_social_user
from app.core.security import create_access_token
from app.core.config import settings
from app.utils.email import send_verification_email, generate_email_verification_token, verify_email_token
from app.models.user import AuthProvider

router = APIRouter(prefix="/auth", tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

async def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id: int = int(payload.get("sub"))
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = get_user(db, user_id=user_id)
    if user is None:
        raise credentials_exception
    return user

def get_current_verified_user(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified",
        )
    return current_user

@router.post("/register", response_model=User)
async def register(
    background_tasks: BackgroundTasks,
    user_in: UserCreate,
    db: Session = Depends(get_db)
):
    user = create_user(db, user_in)
    
    # Generate verification token
    token = generate_email_verification_token(user.email)
    
    # Send verification email
    background_tasks.add_task(send_verification_email, user.email, token)
    
    return user

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/social-login", response_model=Token)
async def social_login(
    login_data: SocialLogin,
    db: Session = Depends(get_db)
):
    # This would normally validate with the provider and get user details
    # For now we'll mock it with dummy data based on the provider
    
    if login_data.provider == AuthProvider.GOOGLE:
        # Mock Google Auth
        email = "user@example.com"
        username = "Google User"
        provider_user_id = "google_12345"
    elif login_data.provider == AuthProvider.FACEBOOK:
        # Mock Facebook Auth
        email = "user@example.com"
        username = "Facebook User"
        provider_user_id = "facebook_12345"
    elif login_data.provider == AuthProvider.INSTAGRAM:
        # Mock Instagram Auth
        email = "user@example.com"
        username = "Instagram User"
        provider_user_id = "instagram_12345"
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid provider",
        )
    
    # Create or update user
    user = create_social_user(
        db, 
        email=email,
        username=username,
        auth_provider=login_data.provider,
        provider_user_id=provider_user_id
    )
    
    # Generate access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/verify-email")
async def verify_email(token: str = Query(...), db: Session = Depends(get_db)):
    email = verify_email_token(token)
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token",
        )
    
    user = get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    if user.is_verified:
        return {"message": "Email already verified"}
    
    verify_user_email(db, user_id=user.id)
    return {"message": "Email verified successfully"}

@router.get("/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return current_user