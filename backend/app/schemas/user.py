from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from app.models.user import AuthProvider, SubscriptionTier

class UserBase(BaseModel):
    email: EmailStr
    username: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class SocialLogin(BaseModel):
    access_token: str
    provider: AuthProvider

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenData(BaseModel):
    user_id: int
    exp: datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class User(UserBase):
    id: int
    is_active: bool
    is_verified: bool
    auth_provider: AuthProvider
    subscription_tier: SubscriptionTier
    subscription_expiry: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class ChatBase(BaseModel):
    title: Optional[str] = "New Chat"

class ChatCreate(ChatBase):
    pass

class MessageBase(BaseModel):
    content: str
    is_user: bool = True

class MessageCreate(MessageBase):
    pass

class Message(MessageBase):
    id: int
    chat_id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

class Chat(ChatBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    messages: List[Message] = []
    
    class Config:
        orm_mode = True

class UserWithChats(User):
    chats: List[Chat] = []