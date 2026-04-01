import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/admin/dashboard')
    } catch {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    border: '1px solid #e8e8e8', borderRadius: '8px',
    fontSize: '14px', outline: 'none', marginTop: '6px'
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9' }}>
      <div style={{ background: '#fff', padding: '48px', borderRadius: '16px', boxShadow: '0 2px 24px rgba(0,0,0,0.08)', width: '360px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1a1a2e', marginBottom: '8px' }}>
          Rich<span style={{ color: '#e94560' }}>Cart</span> Admin
        </h1>
        <p style={{ fontSize: '13px', color: '#888', marginBottom: '32px' }}>Sign in to manage your products</p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: '#555', display: 'block' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} required />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: '#555', display: 'block' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} required />
          </div>

          {error && <p style={{ color: '#e94560', fontSize: '13px', marginBottom: '16px' }}>{error}</p>}

          <button type="submit" disabled={loading} style={{
            width: '100%', background: loading ? '#aaa' : '#1a1a2e',
            color: '#fff', padding: '12px', borderRadius: '8px',
            border: 'none', fontSize: '14px', fontWeight: 600
          }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
