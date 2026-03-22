from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.schemas.group import GroupCreate, GroupResponse
from backend.services import group as group_service
from backend.auth import get_current_user
from backend.models.user import User
from typing import List

router = APIRouter(prefix="/api/groups", tags=["groups"])

@router.post("/", response_model=GroupResponse)
def create_group(group: GroupCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return group_service.create_group(db, group)

@router.get("/", response_model=List[GroupResponse])
def get_groups(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return group_service.get_groups(db)

@router.get("/{group_id}", response_model=GroupResponse)
def get_group(group_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    group = group_service.get_group(db, group_id)
    if group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    return group