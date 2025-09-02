from __future__ import annotations
from typing import List

from app.schemas.user import UserCreate
from app.repositories.interfaces import UserRepository
from app.services.interfaces import UserService


class DefaultUserService(UserService):
    def __init__(self, repo: UserRepository) -> None:
        self.repo = repo

    def list_users(self) -> List:
        return self.repo.get_all()

    def create_user(self, payload: UserCreate):
        return self.repo.create(payload)

    def delete_user(self, user_id: int) -> bool:
        return self.repo.delete(user_id)
