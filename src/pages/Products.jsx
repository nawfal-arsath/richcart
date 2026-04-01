import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import CategoryFilter from '../components/CategoryFilter'

export default function Products() {
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const fetchProducts = async () => {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setProducts(data)
      const cat = searchParams.get('category')
      if (cat) {
        setActiveCategory(cat)
        setFiltered(data.filter(p => p.category === cat))
      } else {
        setFiltered(data)
      }
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const handleCategory = (cat) => {
    setActiveCategory(cat)
    setFiltered(cat === 'All' ? products : products.filter(p => p.category === cat))
  }

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff' }}>
      <Navbar />
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '32px 20px'
      }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 800, 
            color: '#111827', 
            marginBottom: '8px',
            letterSpacing: '-0.02em'
          }}>
            All Products
          </h1>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '15px',
            fontWeight: 500
          }}>
            {filtered.length} {filtered.length === 1 ? 'product' : 'products'} available
          </p>
        </div>

        <CategoryFilter active={activeCategory} onChange={handleCategory} />

        {loading ? (
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 20px',
            gap: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '3px solid #f3f4f6',
              borderTopColor: '#111827',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ color: '#6b7280', fontSize: '15px' }}>Loading products...</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '100px 20px',
            background: '#f9fafb',
            borderRadius: '16px',
            border: '1px solid #e5e7eb',
            marginTop: '24px'
          }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" style={{ margin: '0 auto 16px' }}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <p style={{ 
              fontSize: '18px',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '8px'
            }}>
              No products found
            </p>
            <p style={{ fontSize: '15px', color: '#9ca3af' }}>
              Try selecting a different category
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 640px) {
          div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }
        
        @media (min-width: 641px) and (max-width: 1024px) {
          div[style*="gridTemplateColumns"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  )
}