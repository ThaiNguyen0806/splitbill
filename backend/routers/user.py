from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.schemas.user import UserCreate, UserResponse, UserLogin, Token
from backend.services import user as user_service
from typing import List
from backend.auth import get_current_user
from backend.models.user import User

router = APIRouter(prefix="/api/users", tags=["users"])

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    created_user = user_service.create_user(db, user)
    if created_user is None:
        raise HTTPException(status_code=400, detail="Email already registered")
    return created_user

@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    token = user_service.login_user(db, user.email, user.password)
    if token is None:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"access_token": token, "token_type": "bearer"}

@router.get("/", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(User).all()