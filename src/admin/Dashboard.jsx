import { Link, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'

export default function Dashboard() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut(auth)
    navigate('/admin')
  }

  const cards = [
    { label: 'Add New Product', desc: 'Upload image and fill in product details', to: '/admin/add', bg: '#e94560' },
    { label: 'Manage Products', desc: 'Edit, delete or mark items as sold', to: '/admin/manage', bg: '#1a1a2e' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f9f9f9' }}>
      <div style={{
        background: '#fff', padding: '0 32px', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
      }}>
        <span style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a2e' }}>
          Rich<span style={{ color: '#e94560' }}>Cart</span> Admin
        </span>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link to="/" style={{ fontSize: '13px', color: '#888' }}>View Site</Link>
          <button onClick={handleLogout} style={{
            background: 'none', border: '1px solid #e8e8e8',
            padding: '8px 16px', borderRadius: '8px', fontSize: '13px', color: '#555'
          }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '60px auto', padding: '0 24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '8px', color: '#1a1a2e' }}>Dashboard</h1>
        <p style={{ color: '#888', marginBottom: '40px', fontSize: '14px' }}>Manage your RichCart store</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {cards.map(c => (
            <Link
              key={c.to}
              to={c.to}
              style={{
                background: c.bg, color: '#fff',
                padding: '36px 32px', borderRadius: '16px',
                textDecoration: 'none', display: 'block',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>{c.label}</h2>
              <p style={{ fontSize: '13px', opacity: 0.75 }}>{c.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
