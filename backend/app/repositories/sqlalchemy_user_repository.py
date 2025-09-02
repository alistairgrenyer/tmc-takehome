from __future__ import annotations
from typing import List
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate
from app.repositories.interfaces import UserRepository


class SQLAlchemyUserRepository(UserRepository):
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_all(self) -> List[User]:
        return self.db.query(User).order_by(User.id.asc()).all()

    def create(self, obj_in: UserCreate) -> User:
        db_obj = User(
            firstname=obj_in.firstname,
            lastname=obj_in.lastname,
            date_of_birth=obj_in.date_of_birth,
        )
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def delete(self, user_id: int) -> bool:
        obj = self.db.query(User).filter(User.id == user_id).first()
        if not obj:
            return False
        self.db.delete(obj)
        self.db.commit()
        return True
