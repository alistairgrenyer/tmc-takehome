from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from app.schemas.user import UserRead, UserCreate
from app.api.deps import get_user_service
from app.services.interfaces import UserService

router = APIRouter()

@router.get("/users", response_model=List[UserRead])
def list_users(service: UserService = Depends(get_user_service)):
    return service.list_users()

@router.post("/users/create", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def create_user_endpoint(payload: UserCreate, service: UserService = Depends(get_user_service)):
    return service.create_user(payload)

@router.delete("/user", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_endpoint(id: int, service: UserService = Depends(get_user_service)):
    ok = service.delete_user(id)
    if not ok:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return None
