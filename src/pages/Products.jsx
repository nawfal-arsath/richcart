import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
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
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProducts = async () => {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setProducts(data)

      const searchQuery = searchParams.get('search') || ''
      const cat = searchParams.get('category')

      setSearchTerm(searchQuery)
      if (cat) setActiveCategory(cat)
      applyFilters(data, cat || 'All', searchQuery)
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const applyFilters = (productList, category, search) => {
    let result = productList
    if (category !== 'All') result = result.filter(p => p.category === category)
    if (search.trim()) {
      const searchLower = search.toLowerCase().trim()
      result = result.filter(p =>
        p.name?.toLowerCase().includes(searchLower) ||
        p.category?.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower) ||
        p.brand?.toLowerCase().includes(searchLower)
      )
    }
    setFiltered(result)
  }

  const handleCategory = (cat) => {
    setActiveCategory(cat)
    applyFilters(products, cat, searchTerm)
    const params = new URLSearchParams()
    if (cat !== 'All') params.set('category', cat)
    if (searchTerm) params.set('search', searchTerm)
    setSearchParams(params)
  }

  const handleSearch = (search) => {
    setSearchTerm(search)
    applyFilters(products, activeCategory, search)
    const params = new URLSearchParams()
    if (activeCategory !== 'All') params.set('category', activeCategory)
    if (search) params.set('search', search)
    setSearchParams(params)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    handleSearch(searchTerm)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setActiveCategory('All')
    setFiltered(products)
    setSearchParams({})
  }

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff' }}>
      <Navbar onSearch={(term) => {
        setSearchTerm(term)
        applyFilters(products, activeCategory, term)
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>

        {/* Header with Search */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            All Products
          </h1>
          <p style={{ color: '#6b7280', fontSize: '15px', fontWeight: 500, marginBottom: '20px' }}>
            {filtered.length} {filtered.length === 1 ? 'product' : 'products'} available
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative', maxWidth: '500px', marginBottom: '8px' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products by name, brand, category..."
              style={{
                width: '100%', padding: '14px 50px 14px 18px',
                borderRadius: '12px', border: '1px solid #e5e7eb',
                fontSize: '15px', fontFamily: '"Poppins", sans-serif',
                outline: 'none', transition: 'all 0.2s', background: '#f9fafb'
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#111827'; e.currentTarget.style.background = '#ffffff' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = '#f9fafb' }}
            />
            <button type="submit" style={{
              position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
              background: '#111827', border: 'none', borderRadius: '8px',
              padding: '10px 14px', cursor: 'pointer', color: '#ffffff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s'
            }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#1f2937'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#111827'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </form>

          {/* Active Filters */}
          {(searchTerm || activeCategory !== 'All') && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>Active filters:</span>
              {searchTerm && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f3f4f6', padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, color: '#374151' }}>
                  Search: "{searchTerm}"
                  <button onClick={() => handleSearch('')} style={{ background: 'transparent', border: 'none', padding: '2px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#6b7280' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </button>
                </span>
              )}
              {activeCategory !== 'All' && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f3f4f6', padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, color: '#374151' }}>
                  Category: {activeCategory}
                  <button onClick={() => handleCategory('All')} style={{ background: 'transparent', border: 'none', padding: '2px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#6b7280' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </button>
                </span>
              )}
              <button onClick={clearFilters} style={{ background: 'transparent', border: 'none', padding: '4px 8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#ef4444', textDecoration: 'underline' }}>
                Clear all
              </button>
            </div>
          )}
        </div>

        <CategoryFilter active={activeCategory} onChange={handleCategory} />

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', border: '3px solid #f3f4f6', borderTopColor: '#111827', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#6b7280', fontSize: '15px' }}>Loading products...</p>
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '100px 20px', background: '#f9fafb', borderRadius: '16px', border: '1px solid #e5e7eb', marginTop: '24px' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" style={{ margin: '0 auto 16px' }}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <p style={{ fontSize: '18px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>No products found</p>
            <p style={{ fontSize: '15px', color: '#9ca3af', marginBottom: '16px' }}>
              {searchTerm
                ? `No results for "${searchTerm}"${activeCategory !== 'All' ? ` in ${activeCategory}` : ''}`
                : `No products in ${activeCategory} category`}
            </p>
            <button onClick={clearFilters} style={{ background: '#111827', color: '#ffffff', border: 'none', padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#1f2937'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#111827'}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }

        @media (max-width: 640px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
        }

        @media (min-width: 641px) and (max-width: 1024px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </div>
  )
}