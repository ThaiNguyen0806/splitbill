from sqlalchemy.orm import Session, joinedload
from backend.models.expense import Expense
from backend.models.split import Split
from backend.schemas.expense import ExpenseCreate

def create_expense(db: Session, expense: ExpenseCreate):
    db_expense = Expense(
        description=expense.description,
        amount=expense.amount,
        paid_by=expense.paid_by,
        group_id=expense.group_id
    )
    db.add(db_expense)
    db.flush()

    for split in expense.splits:
        db_split = Split(
            expense_id=db_expense.id,
            user_id=split.user_id,
            amount_owed=split.amount_owed
        )
        db.add(db_split)

    db.commit()
    db_expense = db.query(Expense).options(joinedload(Expense.splits)).filter(Expense.id == db_expense.id).first()
    return db_expense

def get_expenses(db: Session, group_id: int):
    return db.query(Expense).options(joinedload(Expense.splits)).filter(Expense.group_id == group_id).all()