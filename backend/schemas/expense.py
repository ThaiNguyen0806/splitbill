from pydantic import BaseModel
from typing import List

class SplitCreate(BaseModel):
    user_id: int
    amount_owed: float

class ExpenseCreate(BaseModel):
    description: str
    amount: float
    paid_by: int
    group_id: int
    splits: List[SplitCreate]

class SplitResponse(BaseModel):
    id: int
    user_id: int
    amount_owed: float
    is_settled: bool

    class Config:
        from_attributes = True

class ExpenseResponse(BaseModel):
    id: int
    description: str
    amount: float
    paid_by: int
    group_id: int
    splits: List[SplitResponse]

    class Config:
        from_attributes = True