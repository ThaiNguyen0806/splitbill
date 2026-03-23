from sqlalchemy.orm import Session
from sqlalchemy import text
from collections import defaultdict

def get_balances(db: Session, group_id: int):
    raw = db.execute(text("""
        SELECT 
            s.user_id as owes_user,
            u1.name as owes_name,
            e.paid_by as owed_to_user,
            u2.name as owed_to_name,
            SUM(s.amount_owed) as total_amount
        FROM splits s
        JOIN expenses e ON s.expense_id = e.id
        JOIN users u1 ON s.user_id = u1.id
        JOIN users u2 ON e.paid_by = u2.id
        WHERE e.group_id = :group_id
        AND s.is_settled = false
        AND s.user_id != e.paid_by
        GROUP BY s.user_id, u1.name, e.paid_by, u2.name
    """), {"group_id": group_id}).fetchall()

    net = defaultdict(float)
    name_map = {}
    for row in raw:
        owes = row[0]
        owes_name = row[1]
        owed_to = row[2]
        owed_to_name = row[3]
        amount = float(row[4])
        name_map[owes] = owes_name
        name_map[owed_to] = owed_to_name
        key = tuple(sorted([owes, owed_to]))
        if owes < owed_to:
            net[key] += amount
        else:
            net[key] -= amount

    balances = []
    for (user_a, user_b), amount in net.items():
        if amount > 0:
            balances.append({
                "owes": name_map[user_a],
                "owed_to": name_map[user_b],
                "amount": round(amount, 2)
            })
        elif amount < 0:
            balances.append({
                "owes": name_map[user_b],
                "owed_to": name_map[user_a],
                "amount": round(abs(amount), 2)
            })

    return balances