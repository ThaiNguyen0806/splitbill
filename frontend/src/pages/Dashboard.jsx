import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API = 'http://localhost:8000'

function Dashboard() {
  const [groups, setGroups] = useState([])
  const [newGroup, setNewGroup] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    fetchGroups()
    fetchCurrentUser()
  }, [])

  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get(`${API}/api/users/me`, { headers })
      setCurrentUser(res.data)
    } catch {
      localStorage.removeItem('token')
      navigate('/login')
    }
  }

  const fetchGroups = async () => {
    try {
      const res = await axios.get(`${API}/api/groups/`, { headers })
      setGroups(res.data)
    } finally {
      setLoading(false)
    }
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

  if (loading) return <div style={{ textAlign: 'center', marginTop: 100 }}>Loading...</div>

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Splitbill</h2>
        <div>
          {currentUser && <span style={{ marginRight: 10, color: '#888' }}>Hi, {currentUser.name}</span>}
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h3>Your Groups</h3>
        <input placeholder="Group name" value={newGroup} onChange={e => setNewGroup(e.target.value)} style={{ padding: 8, marginRight: 10 }} />
        <button onClick={createGroup}>Create Group</button>
      </div>

      {groups.length === 0 && <p style={{ color: '#888' }}>No groups yet. Create one above!</p>}
      {groups.map(group => (
        <div key={group.id} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10, borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong>{group.name}</strong>
          <button onClick={() => navigate(`/groups/${group.id}`)}>View Group</button>
        </div>
      ))}
    </div>
  )
}

export default Dashboard