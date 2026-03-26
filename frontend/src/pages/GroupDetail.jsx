import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'

const API = 'http://localhost:8000'

function GroupDetail() {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  const [expenses, setExpenses] = useState([])
  const [balances, setBalances] = useState([])
  const [users, setUsers] = useState([])
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [paidBy, setPaidBy] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    fetchExpenses()
    fetchBalances()
    fetchUsers()
  }, [])

  const fetchExpenses = async () => {
    const res = await axios.get(`${API}/api/expenses/${groupId}`, { headers })
    setExpenses(res.data)
  }

  const fetchBalances = async () => {
    const res = await axios.get(`${API}/api/balances/${groupId}`, { headers })
    setBalances(res.data)
  }

  const fetchUsers = async () => {
    const res = await axios.get(`${API}/api/users/`, { headers })
    setUsers(res.data)
  }

  const toggleUser = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    )
  }

  const addExpense = async () => {
    if (!description || !amount || !paidBy || selectedUsers.length === 0) {
      setError('Please fill in all fields and select at least one person to split with')
      return
    }
    const splitAmount = parseFloat(amount) / selectedUsers.length
    const splits = selectedUsers.map(userId => ({ user_id: userId, amount_owed: splitAmount }))
    try {
      await axios.post(`${API}/api/expenses/`, {
        description,
        amount: parseFloat(amount),
        paid_by: parseInt(paidBy),
        group_id: parseInt(groupId),
        splits
      }, { headers })
      setDescription('')
      setAmount('')
      setPaidBy('')
      setSelectedUsers([])
      setError('')
      fetchExpenses()
      fetchBalances()
    } catch (err) {
      setError('Failed to add expense')
    }
  }
  
  const settleSplit = async (splitId) => {
  await axios.put(`${API}/api/splits/settle/${splitId}`, {}, { headers })
  fetchExpenses()
  fetchBalances()
  }

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId)
    return user ? user.name : `User ${userId}`
}

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 20 }}>
      <button onClick={() => navigate('/dashboard')}>← Back</button>
      <h2>Group Expenses</h2>

      <div style={{ border: '1px solid #ccc', padding: 15, borderRadius: 4, marginBottom: 20 }}>
        <h3>Add Expense</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }} />
        <input placeholder="Amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }} />
        <select value={paidBy} onChange={e => setPaidBy(e.target.value)} style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }}>
          <option value="">Who paid?</option>
          {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
        <p style={{ marginBottom: 4 }}>Split between:</p>
        {users.map(u => (
          <label key={u.id} style={{ display: 'block', marginBottom: 4 }}>
            <input type="checkbox" checked={selectedUsers.includes(u.id)} onChange={() => toggleUser(u.id)} /> {u.name}
          </label>
        ))}
        <button onClick={addExpense} style={{ marginTop: 10, padding: '8px 16px' }}>Add Expense</button>
      </div>

      <h3>Expenses</h3>
      {expenses.length === 0 && <p>No expenses yet.</p>}
      {expenses.map(e => (
        <div key={e.id} style={{ border: '1px solid #eee', padding: 10, marginBottom: 8, borderRadius: 4 }}>
          <strong>{e.description}</strong> — ${e.amount}
          <span style={{ color: '#888', marginLeft: 10 }}>paid by {getUserName(e.paid_by)}</span>
          <div style={{ marginTop: 8 }}>
            {e.splits.map(s => (
              <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span>{getUserName(s.user_id)} owes ${s.amount_owed} {s.is_settled && <span style={{ color: 'green' }}>✓ Settled</span>}</span>
                {!s.is_settled && (
                  <button onClick={() => settleSplit(s.id)} style={{ padding: '2px 8px' }}>Settle</button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <h3>Balances</h3>
      {balances.length === 0 && <p>All settled up!</p>}
      {balances.map((b, i) => (
        <p key={i}>{b.owes} owes {b.owed_to} <strong>${b.amount}</strong></p>
      ))}
    </div>
  )
}

export default GroupDetail