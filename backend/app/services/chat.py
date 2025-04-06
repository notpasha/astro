from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException
from sqlalchemy import desc

from app.models.user import Chat, Message, User, SubscriptionTier
from app.core.config import settings

def get_user_chats(db: Session, user_id: int) -> List[Chat]:
    return db.query(Chat).filter(Chat.user_id == user_id).order_by(desc(Chat.updated_at)).all()

def get_chat(db: Session, chat_id: int, user_id: int) -> Chat:
    chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == user_id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return chat

def create_chat(db: Session, user_id: int, title: Optional[str] = "New Chat") -> Chat:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if user has reached chat limit for free tier
    if user.subscription_tier == SubscriptionTier.FREE:
        chat_count = db.query(Chat).filter(Chat.user_id == user_id).count()
        if chat_count >= settings.MAX_FREE_CHATS:
            raise HTTPException(status_code=402, detail="Free tier chat limit reached. Please upgrade to continue.")
    
    db_chat = Chat(user_id=user_id, title=title)
    db.add(db_chat)
    db.commit()
    db.refresh(db_chat)
    return db_chat

def add_message(db: Session, chat_id: int, user_id: int, content: str, is_user: bool = True) -> Message:
    chat = get_chat(db, chat_id=chat_id, user_id=user_id)
    
    db_message = Message(chat_id=chat_id, content=content, is_user=is_user)
    db.add(db_message)
    
    # Update chat's updated_at timestamp
    chat.updated_at = db.func.now()
    
    db.commit()
    db.refresh(db_message)
    return db_message

def update_chat_title(db: Session, chat_id: int, user_id: int, title: str) -> Chat:
    chat = get_chat(db, chat_id=chat_id, user_id=user_id)
    chat.title = title
    db.commit()
    db.refresh(chat)
    return chat

def delete_chat(db: Session, chat_id: int, user_id: int) -> None:
    chat = get_chat(db, chat_id=chat_id, user_id=user_id)
    db.delete(chat)
    db.commit()
    return None