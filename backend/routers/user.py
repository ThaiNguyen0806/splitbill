from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.schemas.user import UserCreate, UserResponse
from backend.services import user as user_service

router = APIRouter(prefix="/api/users", tags=["users"])

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    created_user = user_service.create_user(db, user)
    if created_user is None:
        raise HTTPException(status_code=400, detail="Email already registered")
    return created_user