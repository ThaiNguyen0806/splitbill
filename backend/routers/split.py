from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.auth import get_current_user
from backend.models.user import User
from backend.services import split as split_service

router = APIRouter(prefix="/api/splits", tags=["splits"])

@router.put("/settle/{split_id}")
def settle_split(split_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = split_service.settle_split(db, split_id, current_user.id)
    if result is None:
        raise HTTPException(status_code=404, detail="Split not found")
    if result == "unauthorized":
        raise HTTPException(status_code=403, detail="You can only settle your own splits")
    return {"message": "Split settled successfully"}