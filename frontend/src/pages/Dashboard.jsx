import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API = 'http://localhost:8000'

function Dashboard() {
  const [groups, setGroups] = useState([])
  const [newGroup, setNewGroup] = useState('')
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    const res = await axios.get(`${API}/api/groups/`, { headers })
    setGroups(res.data)
  }

  const createGroup = async () => {
    if (!newGroup) return
    await axios.post(`${API}/api/groups/`, { name: newGroup }, { headers })
    setNewGroup('')
    fetchGroups()
  }

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Splitbill Dashboard</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h3>Your Groups</h3>
        <input placeholder="Group name" value={newGroup} onChange={e => setNewGroup(e.target.value)} style={{ padding: 8, marginRight: 10 }} />
        <button onClick={createGroup}>Create Group</button>
      </div>

      {groups.map(group => (
        <div key={group.id} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10, borderRadius: 4 }}>
          <strong>{group.name}</strong>
          <button onClick={() => navigate(`/groups/${group.id}`)} style={{ marginLeft: 10 }}>View Group</button>
        </div>
      ))}
    </div>
  )
}

export default Dashboard