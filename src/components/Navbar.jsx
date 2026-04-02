import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar({ onSearch }) {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchTerm.trim() && onSearch) {
      onSearch(searchTerm.trim())
      setSearchOpen(false)
      setSearchTerm('')
    }
  }

  return (
    <>
      <nav style={{
        background: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)'
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span style={{ 
            fontSize: '18px', 
            fontWeight: 450, 
            color: '#111827',
            letterSpacing: '-0.02em',
            fontFamily: '"Poppins", sans-serif'
          }}>
            richcart
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div style={{ 
          display: 'none',
          gap: '8px',
          alignItems: 'center'
        }}
        className="desktop-nav">
          <Link to="/" style={{ 
            fontSize: '15px', 
            fontWeight: 500, 
            color: '#374151',
            padding: '8px 16px',
            borderRadius: '8px',
            textDecoration: 'none',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f3f4f6'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Home
          </Link>
          <Link to="/products" style={{ 
            fontSize: '15px', 
            fontWeight: 500, 
            color: '#374151',
            padding: '8px 16px',
            borderRadius: '8px',
            textDecoration: 'none',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f3f4f6'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Products
          </Link>
          
          {/* Search Icon - Desktop */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '8px',
              cursor: 'pointer',
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </button>

          <a
            href="https://wa.me/7010228720"
            target="_blank"
            rel="noreferrer"
            style={{
              background: '#111827',
              color: '#ffffff',
              padding: '10px 20px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              marginLeft: '8px',
              transition: 'all 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#1f2937'}
            onMouseLeave={e => e.currentTarget.style.background = '#111827'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Contact
          </a>
        </div>

        {/* Mobile - Search and Menu Icons */}
        <div style={{ display: 'none', gap: '8px', alignItems: 'center' }} className="mobile-icons">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '8px',
              cursor: 'pointer',
              color: '#111827',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '8px',
              cursor: 'pointer',
              color: '#111827'
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Search Bar Dropdown */}
      {searchOpen && (
        <div style={{
          position: 'fixed',
          top: '72px',
          left: 0,
          right: 0,
          background: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          padding: '16px 20px',
          zIndex: 999,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          animation: 'slideDown 0.2s ease-out'
        }}>
          <form onSubmit={handleSearchSubmit} style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              autoFocus
              style={{
                width: '100%',
                padding: '12px 48px 12px 16px',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                fontSize: '15px',
                fontFamily: '"Poppins", sans-serif',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#111827'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            />
            <button
              type="submit"
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#111827',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 12px',
                cursor: 'pointer',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#1f2937'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#111827'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {open && (
        <div style={{
          position: 'fixed',
          top: '72px',
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
          animation: 'fadeIn 0.2s ease-out'
        }}
        onClick={() => setOpen(false)}
        >
          <div style={{
            background: '#ffffff',
            padding: '24px',
            animation: 'slideDown 0.3s ease-out'
          }}
          onClick={e => e.stopPropagation()}
          >
            <Link 
              to="/" 
              onClick={() => setOpen(false)}
              style={{ 
                display: 'block',
                fontSize: '16px', 
                fontWeight: 500, 
                color: '#111827',
                padding: '16px',
                borderRadius: '12px',
                textDecoration: 'none',
                marginBottom: '8px',
                background: '#f9fafb'
              }}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              onClick={() => setOpen(false)}
              style={{ 
                display: 'block',
                fontSize: '16px', 
                fontWeight: 500, 
                color: '#111827',
                padding: '16px',
                borderRadius: '12px',
                textDecoration: 'none',
                marginBottom: '16px',
                background: '#f9fafb'
              }}
            >
              Products
            </Link>
            <a
              href="https://wa.me/7010228720"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                background: '#111827',
                color: '#ffffff',
                padding: '18px 24px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 600,
                textDecoration: 'none',
                width: '100%'
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Contact Us on WhatsApp
            </a>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-icons {
            display: none !important;
          }
        }
        @media (max-width: 767px) {
          .mobile-icons {
            display: flex !important;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  )
}