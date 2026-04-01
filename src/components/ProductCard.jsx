import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  const hasDiscount = product.actualPrice && product.sellingPrice &&
    product.actualPrice > product.sellingPrice

  return (
    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid #f3f4f6',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-8px)'
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.08)'
          e.currentTarget.style.borderColor = '#e5e7eb'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
          e.currentTarget.style.borderColor = '#f3f4f6'
        }}
      >
        <div style={{
          width: '100%',
          paddingTop: '100%',
          position: 'relative',
          overflow: 'hidden',
          background: '#f9fafb'
        }}>
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{
              position: 'absolute', top: 0, left: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />

          {/* Discount badge */}
          {hasDiscount && product.discountPercent > 0 && (
            <div style={{
              position: 'absolute', top: '12px', left: '12px',
              background: '#e94560', color: '#fff',
              fontSize: '11px', fontWeight: 700,
              padding: '4px 8px', borderRadius: '6px',
              letterSpacing: '0.3px'
            }}>
              -{product.discountPercent}%
            </div>
          )}

          {product.sold && (
            <div style={{
              position: 'absolute', top: '12px', right: '12px',
              background: 'rgba(17, 24, 39, 0.9)',
              backdropFilter: 'blur(8px)',
              color: '#ffffff', fontSize: '11px', fontWeight: 600,
              padding: '6px 12px', borderRadius: '8px', letterSpacing: '0.5px'
            }}>
              SOLD
            </div>
          )}
        </div>

        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <span style={{
            fontSize: '11px', fontWeight: 600, color: '#6b7280',
            textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px'
          }}>
            {product.category}
          </span>
          <h3 style={{
            fontSize: '17px', fontWeight: 600, color: '#111827',
            margin: '0 0 10px', lineHeight: 1.3, letterSpacing: '-0.01em'
          }}>
            {product.name}
          </h3>
          <p style={{
            fontSize: '14px', color: '#6b7280',
            marginBottom: '16px', lineHeight: 1.5, flex: 1
          }}>
            {product.description?.slice(0, 80)}...
          </p>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            paddingTop: '12px', borderTop: '1px solid #f3f4f6'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {/* Selling price */}
              <span style={{
                fontSize: '20px', fontWeight: 700, color: '#111827', letterSpacing: '-0.02em'
              }}>
                ₹{Number(product.sellingPrice || product.price).toLocaleString('en-IN')}
              </span>
              {/* Actual price struck through */}
              {hasDiscount && (
                <span style={{
                  fontSize: '13px', color: '#9ca3af',
                  textDecoration: 'line-through', fontWeight: 400
                }}>
                  ₹{Number(product.actualPrice).toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}