from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
from typing import List
from pathlib import Path
import jwt
from datetime import datetime, timedelta

from app.core.config import settings

conf = ConnectionConfig(
    MAIL_USERNAME=settings.SMTP_USERNAME,
    MAIL_PASSWORD=settings.SMTP_PASSWORD,
    MAIL_FROM=settings.EMAIL_FROM,
    MAIL_PORT=settings.SMTP_PORT,
    MAIL_SERVER=settings.SMTP_SERVER,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
    TEMPLATE_FOLDER=Path(__file__).parent / "../templates/email"
)

async def send_email(
    email_to: List[EmailStr],
    subject: str,
    body: str,
    template_name: str = None
) -> None:
    message = MessageSchema(
        subject=subject,
        recipients=email_to,
        body=body,
        subtype="html"
    )
    
    fm = FastMail(conf)
    await fm.send_message(message)

def generate_email_verification_token(email: str) -> str:
    expire = datetime.utcnow() + timedelta(hours=24)
    to_encode = {
        "exp": expire,
        "email": email
    }
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")

def verify_email_token(token: str) -> str:
    try:
        decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        return decoded_token["email"]
    except jwt.PyJWTError:
        return None

async def send_verification_email(email_to: EmailStr, token: str) -> None:
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - Verify your email"
    
    verification_url = f"http://localhost:3000/verify-email?token={token}"
    current_year = datetime.now().year
    
    message = MessageSchema(
        subject=subject,
        recipients=[email_to],
        template_body={
            "verification_url": verification_url,
            "current_year": current_year
        },
        subtype="html"
    )
    
    fm = FastMail(conf)
    try:
        await fm.send_message(message, template_name="verification.html")
    except Exception as e:
        # Fallback to simple email if template fails
        body = f"""
        <html>
        <body>
            <p>Hi,</p>
            <p>Welcome to {project_name}!</p>
            <p>Please verify your email by clicking on the link below:</p>
            <p><a href="{verification_url}">{verification_url}</a></p>
            <p>If you didn't request this email, you can safely ignore it.</p>
            <p>Thanks,</p>
            <p>The {project_name} Team</p>
        </body>
        </html>
        """
        
        await send_email(
            email_to=[email_to],
            subject=subject,
            body=body
        )