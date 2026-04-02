import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { doc, getDoc, collection, query, where, limit, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import Navbar from '../components/Navbar'
import WhatsAppButton from '../components/WhatsAppButton'
import ProductCard from '../components/ProductCard'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loadingRelated, setLoadingRelated] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProduct = async () => {
      const snap = await getDoc(doc(db, 'products', id))
      if (snap.exists()) {
        const productData = { id: snap.id, ...snap.data() }
        setProduct(productData)
        
        // Fetch related products from the same category
        if (productData.category) {
          try {
            const q = query(
              collection(db, 'products'),
              where('category', '==', productData.category),
              limit(5)
            )
            const relatedSnap = await getDocs(q)
            const related = relatedSnap.docs
              .map(d => ({ id: d.id, ...d.data() }))
              .filter(p => p.id !== id) // Exclude current product
              .slice(0, 4) // Limit to 4 products
            setRelatedProducts(related)
          } catch (error) {
            console.error('Error fetching related products:', error)
          }
        }
        setLoadingRelated(false)
      }
    }
    fetchProduct()
  }, [id])

  if (!product) return (
    <div style={{ minHeight: '100vh', background: '#ffffff' }}>
      <Navbar />
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '100px 20px', gap: '16px'
      }}>
        <div style={{
          width: '48px', height: '48px',
          border: '3px solid #f3f4f6', borderTopColor: '#111827',
          borderRadius: '50%', animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: '#6b7280', fontSize: '15px' }}>Loading product...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  const hasDiscount = product.actualPrice && product.sellingPrice &&
    product.actualPrice > product.sellingPrice

  const price = product.sellingPrice || product.actualPrice || product.price

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff' }}>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
        <Link
          to="/products"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '14px', color: '#6b7280', fontWeight: 600,
            textDecoration: 'none', marginBottom: '32px', transition: 'color 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#111827'}
          onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Products
        </Link>

        <div className="detail-grid" style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px',
          background: '#ffffff', borderRadius: '20px',
          border: '1px solid #e5e7eb', padding: '32px', marginBottom: '60px'
        }}>
          {/* Image */}
          <div style={{
            borderRadius: '16px', overflow: 'hidden', background: '#f9fafb',
            border: '1px solid #e5e7eb', position: 'relative'
          }}>
            <img src={product.imageUrl} alt={product.name} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }} />
            {hasDiscount && product.discountPercent > 0 && (
              <div style={{
                position: 'absolute', top: '20px', left: '20px',
                background: '#e94560', color: '#ffffff',
                fontSize: '13px', fontWeight: 700,
                padding: '10px 20px', borderRadius: '12px', letterSpacing: '0.5px'
              }}>
                -{product.discountPercent}%
              </div>
            )}
            {product.sold && (
              <div style={{
                position: 'absolute', top: '20px', right: '20px',
                background: 'rgba(17, 24, 39, 0.9)', backdropFilter: 'blur(8px)',
                color: '#ffffff', fontSize: '13px', fontWeight: 700,
                padding: '10px 20px', borderRadius: '12px', letterSpacing: '0.5px'
              }}>
                SOLD OUT
              </div>
            )}
          </div>

          {/* Details */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{
              fontSize: '12px', fontWeight: 700, color: '#6b7280',
              textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px'
            }}>
              {product.category}
            </span>
            <h1 style={{
              fontSize: '36px', fontWeight: 800, color: '#111827',
              margin: '0 0 20px', lineHeight: 1.2, letterSpacing: '-0.02em'
            }}>
              {product.name}
            </h1>
            <p style={{ fontSize: '16px', color: '#6b7280', lineHeight: 1.7, marginBottom: '32px' }}>
              {product.description}
            </p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '32px' }}>
              <div style={{ fontSize: '40px', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>
                ₹{Number(price).toLocaleString('en-IN')}
              </div>
              {hasDiscount && (
                <div style={{ fontSize: '24px', color: '#9ca3af', textDecoration: 'line-through', fontWeight: 400 }}>
                  ₹{Number(product.actualPrice).toLocaleString('en-IN')}
                </div>
              )}
            </div>

            {product.sold ? (
              <div style={{
                background: '#f9fafb', border: '1px solid #e5e7eb', color: '#6b7280',
                padding: '16px 32px', borderRadius: '12px', fontWeight: 600,
                fontSize: '16px', textAlign: 'center'
              }}>
                This item has been sold
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Buy Now Button */}
                <button
                  onClick={() => navigate(`/checkout/${product.id}`)}
                  style={{
                    width: '100%', padding: '16px 32px',
                    background: '#111827', color: '#ffffff',
                    border: 'none', borderRadius: '12px',
                    fontSize: '16px', fontWeight: 500,
                    cursor: 'pointer', transition: 'background 0.2s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#1f2937'}
                  onMouseLeave={e => e.currentTarget.style.background = '#111827'}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                  Buy Now
                </button>

                {/* WhatsApp Enquire */}
                <WhatsAppButton
                  productName={product.name}
                  price={price}
                />
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section style={{ marginBottom: '60px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 800,
                color: '#111827',
                letterSpacing: '-0.01em',
                margin: 0
              }}>
                Related Products
              </h2>
              <Link
                to="/products"
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#6b7280',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#111827'}
                onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
              >
                SEE ALL →
              </Link>
            </div>

            {loadingRelated ? (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '40px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: '3px solid #f3f4f6',
                  borderTopColor: '#111827',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
              </div>
            ) : (
              <div className="related-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '12px'
              }}>
                {relatedProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        
        @media (max-width: 768px) {
          .detail-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
            padding: 24px !important;
          }
          .detail-grid h1 { font-size: 28px !important; }
          
          .related-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
        }
      `}</style>
    </div>
  )
}