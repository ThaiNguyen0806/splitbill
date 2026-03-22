from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.schemas.expense import ExpenseCreate, ExpenseResponse
from backend.services import expense as expense_service
from backend.auth import get_current_user
from backend.models.user import User
from typing import List

router = APIRouter(prefix="/api/expenses", tags=["expenses"])

@router.post("/", response_model=ExpenseResponse)
def create_expense(expense: ExpenseCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return expense_service.create_expense(db, expense)

@router.get("/{group_id}", response_model=List[ExpenseResponse])
def get_expenses(group_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return expense_service.get_expenses(db, group_id)