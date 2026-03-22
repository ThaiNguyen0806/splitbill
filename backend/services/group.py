from sqlalchemy.orm import Session
from backend.models.group import Group
from backend.schemas.group import GroupCreate

def create_group(db: Session, group: GroupCreate):
    db_group = Group(name=group.name)
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return db_group

def get_groups(db: Session):
    return db.query(Group).all()

def get_group(db: Session, group_id: int):
    return db.query(Group).filter(Group.id == group_id).first()