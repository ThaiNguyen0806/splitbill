from sqlalchemy.orm import Session
from backend.models.split import Split

def settle_split(db: Session, split_id: int, user_id: int):
    split = db.query(Split).filter(Split.id == split_id).first()
    if split is None:
        return None
    if split.user_id != user_id:
        return "unauthorized"
    split.is_settled = True
    db.commit()
    db.refresh(split)
    return split