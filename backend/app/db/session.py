from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings
from app.db.base import Base
from app.core.logging import logger

database_url = settings.DATABASE_URL

# Handle SQLite vs PostgreSQL configuration
connect_args = {}
if database_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    database_url,
    connect_args=connect_args,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    """Initializes tables on startup if they do not exist."""
    try:
        from app.db import models  # noqa
        Base.metadata.create_all(bind=engine)
        logger.info("Database initialized successfully.")
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")

# Ensure tables exist immediately
init_db()

def get_db():
    """FastAPI dependency for database session."""
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
