from __future__ import annotations
from typing import Protocol, List
from app.models.user import User
from app.schemas.user import UserCreate

class UserService(Protocol):
    def list_users(self) -> List[User]:
        ...

    def create_user(self, payload: UserCreate) -> User:
        ...

    def delete_user(self, user_id: int) -> bool:
        ...
