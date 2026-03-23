from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.auth import get_current_user
from backend.models.user import User
from backend.services import balance as balance_service

router = APIRouter(prefix="/api/balances", tags=["balances"])

@router.get("/{group_id}")
def get_balances(group_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return balance_service.get_balances(db, group_id)