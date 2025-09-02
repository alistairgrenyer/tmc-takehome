from typing import Generator
from app.db.session import SessionLocal
from fastapi import Depends

from app.repositories.sqlalchemy_user_repository import SQLAlchemyUserRepository
from app.services.user_service import DefaultUserService


def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_user_repository(db=Depends(get_db)):
    return SQLAlchemyUserRepository(db)


def get_user_service(repo=Depends(get_user_repository)):
    return DefaultUserService(repo)
