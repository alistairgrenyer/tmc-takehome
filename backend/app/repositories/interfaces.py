from __future__ import annotations
from typing import Protocol, List
from app.models.user import User
from app.schemas.user import UserCreate

class UserRepository(Protocol):
    def get_all(self) -> List[User]:
        ...

    def create(self, obj_in: UserCreate) -> User:
        ...

    def delete(self, user_id: int) -> bool:
        ...
