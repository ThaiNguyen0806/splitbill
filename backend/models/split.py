from sqlalchemy import Column, Integer, Float, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from backend.database import Base

class Split(Base):
    __tablename__ = "splits"

    id = Column(Integer, primary_key=True, index=True)
    expense_id = Column(Integer, ForeignKey("expenses.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount_owed = Column(Float, nullable=False)
    is_settled = Column(Boolean, default=False)

    expense = relationship("Expense", back_populates="splits")