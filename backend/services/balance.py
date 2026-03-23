from sqlalchemy.orm import Session
from sqlalchemy import text
from collections import defaultdict

def get_balances(db: Session, group_id: int):
    raw = db.execute(text("""
        SELECT 
            s.user_id as owes_user,
            e.paid_by as owed_to_user,
            SUM(s.amount_owed) as total_amount
        FROM splits s
        JOIN expenses e ON s.expense_id = e.id
        WHERE e.group_id = :group_id
        AND s.is_settled = false
        AND s.user_id != e.paid_by
        GROUP BY s.user_id, e.paid_by
    """), {"group_id": group_id}).fetchall()

    net = defaultdict(float)
    for row in raw:
        owes = row[0]
        owed_to = row[1]
        amount = float(row[2])
        key = tuple(sorted([owes, owed_to]))
        if owes < owed_to:
            net[key] += amount
        else:
            net[key] -= amount

    balances = []
    for (user_a, user_b), amount in net.items():
        if amount > 0:
            balances.append({"owes": user_a, "owed_to": user_b, "amount": round(amount, 2)})
        elif amount < 0:
            balances.append({"owes": user_b, "owed_to": user_a, "amount": round(abs(amount), 2)})

    return balances