import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const API = 'http://localhost:8000'

function Login() {
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) navigate('/dashboard')
  }, [])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API}/api/users/login`, { email, password })
      localStorage.setItem('token', res.data.access_token)
      navigate('/dashboard')
    } catch (err) {
      setError('Invalid email or password')
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 20 }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8 }} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8 }} />
      <button onClick={handleLogin} style={{ width: '100%', padding: 10 }}>Login</button>
      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  )
}

export default Login