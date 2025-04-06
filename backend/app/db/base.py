from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

# Create SQLAlchemy engine
engine = create_engine(settings.DATABASE_URL)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class
Base = declarative_base()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Function to initialize database with seed data
def init_db(db):
    """Seed the database with initial data."""
    from app.models.user import User, AuthProvider, SubscriptionTier
    from sqlalchemy import text
    from datetime import datetime, timedelta
    from passlib.context import CryptContext
    
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    
    # Check if users table already has data
    result = db.execute(text("SELECT COUNT(*) FROM users")).scalar()
    
    if result == 0:
        # Create default admin user
        admin_user = User(
            email="admin@astrological-ai.com",
            username="Admin",
            hashed_password=pwd_context.hash("admin123"),
            is_active=True,
            is_verified=True,
            auth_provider=AuthProvider.EMAIL,
            subscription_tier=SubscriptionTier.PROFESSIONAL,
            subscription_expiry=datetime.now() + timedelta(days=365),
        )
        
        # Create demo user
        demo_user = User(
            email="user@example.com",
            username="DemoUser",
            hashed_password=pwd_context.hash("password123"),
            is_active=True,
            is_verified=True,
            auth_provider=AuthProvider.EMAIL,
            subscription_tier=SubscriptionTier.FREE,
            subscription_expiry=None,
        )
        
        db.add(admin_user)
        db.add(demo_user)
        db.commit()
        
        print("Database initialized with seed data.")