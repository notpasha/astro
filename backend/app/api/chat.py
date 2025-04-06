from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from typing import List

from app.db.base import get_db
from app.schemas.user import Chat, User, MessageCreate, Message
from app.services.chat import get_user_chats, get_chat, create_chat, add_message, update_chat_title, delete_chat
from app.api.auth import get_current_verified_user
from app.services.astro import get_astro_response

router = APIRouter(prefix="/chats", tags=["chats"])

@router.get("/", response_model=List[Chat])
def read_chats(
    current_user: User = Depends(get_current_verified_user),
    db: Session = Depends(get_db)
):
    """Get all chats for the current user"""
    return get_user_chats(db, user_id=current_user.id)

@router.post("/", response_model=Chat)
def create_new_chat(
    title: str = Body("New Chat"),
    current_user: User = Depends(get_current_verified_user),
    db: Session = Depends(get_db)
):
    """Create a new chat session"""
    return create_chat(db, user_id=current_user.id, title=title)

@router.get("/{chat_id}", response_model=Chat)
def read_chat(
    chat_id: int,
    current_user: User = Depends(get_current_verified_user),
    db: Session = Depends(get_db)
):
    """Get a specific chat with all messages"""
    return get_chat(db, chat_id=chat_id, user_id=current_user.id)

@router.put("/{chat_id}", response_model=Chat)
def update_chat(
    chat_id: int,
    title: str = Body(...),
    current_user: User = Depends(get_current_verified_user),
    db: Session = Depends(get_db)
):
    """Update chat title"""
    return update_chat_title(db, chat_id=chat_id, user_id=current_user.id, title=title)

@router.delete("/{chat_id}")
def remove_chat(
    chat_id: int,
    current_user: User = Depends(get_current_verified_user),
    db: Session = Depends(get_db)
):
    """Delete a chat"""
    delete_chat(db, chat_id=chat_id, user_id=current_user.id)
    return {"message": "Chat deleted successfully"}

@router.post("/{chat_id}/messages", response_model=List[Message])
async def create_message(
    chat_id: int,
    message: MessageCreate,
    current_user: User = Depends(get_current_verified_user),
    db: Session = Depends(get_db)
):
    """Create a new message and get AI response"""
    # Save user message
    user_message = add_message(
        db, 
        chat_id=chat_id, 
        user_id=current_user.id, 
        content=message.content,
        is_user=True
    )
    
    # Generate AI response
    ai_response = get_astro_response(message.content, current_user.username)
    
    # Save AI response
    ai_message = add_message(
        db,
        chat_id=chat_id,
        user_id=current_user.id,
        content=ai_response,
        is_user=False
    )
    
    return [user_message, ai_message]