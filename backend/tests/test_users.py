from __future__ import annotations
from datetime import datetime, date, timezone
from typing import List

from fastapi.testclient import TestClient

from app.main import app
from app.schemas.user import UserCreate
from app.api.deps import get_user_service
from app.services.interfaces import UserService


class FakeUser:
    def __init__(self, id: int, firstname: str, lastname: str, date_of_birth: date):
        self.id = id
        self.firstname = firstname
        self.lastname = lastname
        self.date_of_birth = date_of_birth
        self.created_at = datetime.now(timezone.utc)
        self.updated_at = datetime.now(timezone.utc)


class FakeUserService(UserService):
    def __init__(self) -> None:
        self._data: List[FakeUser] = []
        self._next_id = 1

    def list_users(self) -> List[FakeUser]:
        return list(self._data)

    def create_user(self, payload: UserCreate) -> FakeUser:
        user = FakeUser(
            id=self._next_id,
            firstname=payload.firstname,
            lastname=payload.lastname,
            date_of_birth=payload.date_of_birth,
        )
        self._next_id += 1
        self._data.append(user)
        return user

    def delete_user(self, user_id: int) -> bool:
        for i, u in enumerate(self._data):
            if u.id == user_id:
                del self._data[i]
                return True
        return False


fake_service = FakeUserService()


def override_get_user_service():
    return fake_service


app.dependency_overrides[get_user_service] = override_get_user_service
client = TestClient(app)

def test_empty_list():
    r = client.get("/users")
    assert r.status_code == 200
    assert r.json() == []

def test_create_and_list_and_delete():
    payload = {
        "firstname": "Ada",
        "lastname": "Lovelace",
        "date_of_birth": "1815-12-10"
    }
    r = client.post("/users/create", json=payload)
    assert r.status_code == 201
    created = r.json()
    assert created["firstname"] == payload["firstname"]
    assert "age" in created

    r = client.get("/users")
    assert r.status_code == 200
    data = r.json()
    assert len(data) == 1
    assert "age" in data[0]

    user_id = created["id"]
    r = client.delete(f"/user?id={user_id}")
    assert r.status_code == 204

    r = client.get("/users")
    assert r.status_code == 200
    assert r.json() == []
