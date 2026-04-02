import { useEffect, useState } from 'react'
import { collection, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'
import { Link, useNavigate } from 'react-router-dom'

export default function ManageProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const navigate = useNavigate()

  const fetchProducts = async () => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    setLoading(false)
  }

  useEffect(() => { fetchProducts() }, [])

  const handleDelete = async (product) => {
    setDeletingId(product.id)

    try {
      if (product.imagePublicId) {
        await fetch('/api/delete-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicId: product.imagePublicId })
        })
      }

      await deleteDoc(doc(db, 'products', product.id))
      setProducts(prev => prev.filter(p => p.id !== product.id))

    } catch (err) {
      console.error(err)
      alert('Something went wrong while deleting. Try again.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9f9f9' }}>
      <div style={{
        background: '#fff', padding: '0 32px', height: '64px',
        display: 'flex', alignItems: 'center', gap: '16px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
      }}>
        <Link to="/admin/dashboard" style={{ fontSize: '13px', color: '#e94560', fontWeight: 600 }}>← Back</Link>
        <span style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a2e' }}>
          Manage Products {!loading && `(${products.length})`}
        </span>
      </div>

      <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 24px' }}>
        {loading && (
          <p style={{ color: '#aaa', textAlign: 'center', padding: '60px 0' }}>Loading products...</p>
        )}

        {products.map(p => (
          <div key={p.id} style={{
            background: '#fff', borderRadius: '12px',
            padding: '16px 20px', marginBottom: '12px',
            display: 'flex', alignItems: 'center', gap: '16px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            opacity: deletingId === p.id ? 0.5 : 1,
            transition: 'opacity 0.2s'
          }}>
            <img
              src={p.imageUrl}
              alt={p.name}
              style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px', background: '#f5f5f5', flexShrink: 0 }}
            />

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 600, fontSize: '15px', color: '#1a1a2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {p.name}
              </p>
              <p style={{ fontSize: '12px', color: '#888' }}>
                {p.category} · ₹{Number(p.price).toLocaleString('en-IN')}
              </p>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => navigate(`/admin/edit/${p.id}`)}
              style={{
                padding: '6px 14px', borderRadius: '6px', border: '1px solid #b8d4f8',
                fontSize: '12px', fontWeight: 600, cursor: 'pointer', flexShrink: 0,
                background: '#eaf2ff',
                color: '#1a5ec4',
              }}
            >
              Edit
            </button>

            {/* Delete Button */}
            <button
              onClick={() => {
                if (confirmDeleteId === p.id) {
                  handleDelete(p)
                  setConfirmDeleteId(null)
                } else {
                  setConfirmDeleteId(p.id)
                  setTimeout(() => setConfirmDeleteId(null), 3000)
                }
              }}
              disabled={deletingId === p.id}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: '1px solid #f5bec8',
                fontSize: '12px',
                fontWeight: 600,
                cursor: deletingId === p.id ? 'not-allowed' : 'pointer',
                background: confirmDeleteId === p.id ? '#e94560' : '#ffeaea',
                color: confirmDeleteId === p.id ? '#fff' : '#e94560',
                flexShrink: 0,
                transition: 'all 0.2s ease'
              }}
            >
              {deletingId === p.id
                ? 'Deleting...'
                : confirmDeleteId === p.id
                ? 'Click again to confirm'
                : 'Delete'}
            </button>
          </div>
        ))}

        {!loading && products.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#888' }}>
            <p>No products yet.</p>
            <Link to="/admin/add" style={{ color: '#e94560', fontWeight: 600, fontSize: '14px' }}>
              Add your first product →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}