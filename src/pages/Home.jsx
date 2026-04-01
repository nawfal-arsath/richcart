import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import CategoryFilter from '../components/CategoryFilter'

export default function Home() {
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('All')

  const banners = [
    { id: 1, title: 'iPhone 17 Pro',      img: '/banners/1.png' },
    { id: 2, title: 'Samsung Galaxy S25', img: '/banners/2.jpg'   },
    { id: 3, title: 'iphone 17 air',        img: '/banners/3.png'    },
  ]

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
        const snap = await getDocs(q)
        setAllProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (error) {
        console.error('Error fetching products:', error)
      }
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const featured = useMemo(() => {
    const filtered = selectedCategory === 'All'
      ? allProducts
      : allProducts.filter(p => p.category === selectedCategory)
    return filtered.slice(0, 8)
  }, [allProducts, selectedCategory])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const nextBanner = () => setCurrentBannerIndex(prev => (prev + 1) % banners.length)
  const prevBanner = () => setCurrentBannerIndex(prev => (prev - 1 + banners.length) % banners.length)

  return (
    <div className="page-root">
      <Navbar />

      {/* ── Hero Banner Carousel ── */}
      <section className="banner-section">
        <div className="banner-slide">

          {/* Full background image */}
          <img
            src={banners[currentBannerIndex].img}
            alt={banners[currentBannerIndex].title}
            className="banner-bg-img"
          />

          {/* Dark gradient overlay */}
          <div className="banner-overlay" />

          {/* Text */}
          <div className="banner-text">
            <p className="banner-eyebrow">New Launch</p>
            <h1 className="banner-title">{banners[currentBannerIndex].title}</h1>
          </div>

          {/* Arrows */}
          <button className="arrow arrow-left" onClick={prevBanner} aria-label="Previous">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <button className="arrow arrow-right" onClick={nextBanner} aria-label="Next">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 5l7 7-7 7"/>
            </svg>
          </button>

          {/* Dots */}
          <div className="dots">
            {banners.map((_, i) => (
              <button
                key={i}
                className={`dot ${i === currentBannerIndex ? 'dot-active' : ''}`}
                onClick={() => setCurrentBannerIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>


        </div>
      </section>

      {/* ── Latest Launches ── */}
      <section className="launches-section">
        <div className="inner">
          <div className="section-header">
            <h2 className="section-title">LATEST LAUNCHES</h2>
            <Link to="/products" className="see-all">SEE ALL →</Link>
          </div>

          <CategoryFilter active={selectedCategory} onChange={setSelectedCategory} />

          {loading ? (
            <div className="spinner-wrap">
              <div className="spinner" />
              <p className="spinner-text">Loading products…</p>
            </div>
          ) : featured.length === 0 ? (
            <div className="spinner-wrap">
              <p className="spinner-text">No products found in this category.</p>
            </div>
          ) : (
            <div className="products-grid">
              {featured.map(p => (
                <div key={p.id} className="product-card-wrap">
                  {p.discount && (
                    <span className="discount-badge">-{p.discount}%</span>
                  )}
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Trust Features ── */}
      <section className="features-section">
        <div className="inner features-grid">
          {[
            {
              icon: (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2">
                  <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
              ),
              heading: 'Quality Verified',
              body: 'Every product undergoes rigorous quality checks',
            },
            {
              icon: <span style={{ fontSize: '22px', fontWeight: 800, color: '#111827' }}>₹</span>,
              heading: 'Best Prices',
              body: 'Premium quality at competitive market rates',
            },
            {
              icon: (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              ),
              heading: 'Quick Support',
              body: 'Instant assistance via WhatsApp',
            },
          ].map(f => (
            <div key={f.heading} className="feature-item">
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-heading">{f.heading}</h3>
              <p className="feature-body">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="inner footer-grid">
          <div className="footer-brand">
            <h2 className="footer-logo">RichCart</h2>
            <p className="footer-tagline">Your one-stop shop for the latest gadgets & electronics.</p>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Contact Us</h4>
            <ul className="footer-list">
              <li>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.21 3.53 2 2 0 0 1 3.18 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.29 6.29l1.28-1.28a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                +91 98949 80387
              </li>
              <li>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                richcart@gmail.com
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Address</h4>
            <ul className="footer-list">
              <li>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                Shop no 104, Scott Road, Meenakshi bazzar, Madurai.
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Follow Us</h4>
            <a href="https://instagram.com/richcart" target="_blank" rel="noopener noreferrer" className="insta-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
              @richcart
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} RichCart. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .page-root {
          min-height: 100vh;
          background: #fff;
          font-family: 'Poppins', sans-serif;
          color: #111827;
        }

        .inner { max-width: 1280px; margin: 0 auto; padding: 0 20px; }

        /* ── Banner ── */
        .banner-section {
          width: 100%;
          background: #000;
        }

        .banner-slide {
          position: relative;
          width: 100%;
          height: 420px;
          overflow: hidden;
          display: flex;
          align-items: flex-end;
          padding: 0 48px 40px;
          border-radius: 0 0 20px 20px;
        }

        .banner-bg-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .banner-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.75) 0%,
            rgba(0,0,0,0.25) 50%,
            rgba(0,0,0,0.05) 100%
          );
          z-index: 1;
        }

        .banner-text {
          position: relative;
          z-index: 2;
        }

        .banner-eyebrow {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.12em;
          color: rgba(255,255,255,0.65);
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .banner-title {
          font-size: 44px;
          font-weight: 800;
          color: #fff;
          line-height: 1.05;
          letter-spacing: -0.02em;
        }

        /* Transparent arrows */
        .arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.35);
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          color: rgba(255,255,255,0.75);
          transition: color 0.2s, border-color 0.2s;
        }
        .arrow:hover {
          color: #fff;
          border-color: rgba(255,255,255,0.8);
        }
        .arrow-left  { left: 16px; }
        .arrow-right { right: 16px; }

        /* Dots */
        .dots {
          position: absolute;
          bottom: 20px;
          right: 24px;
          display: flex;
          gap: 6px;
          z-index: 10;
        }

        .dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(255,255,255,0.4);
          border: none;
          cursor: pointer;
          padding: 0;
          transition: width 0.3s, background 0.3s;
        }
        .dot-active { width: 22px; border-radius: 4px; background: #fff; }

        /* ── Latest Launches ── */
        .launches-section { background: #fff; padding: 40px 20px 60px; }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .section-title { font-size: 20px; font-weight: 800; color: #111827; letter-spacing: 0.04em; }

        .see-all { font-size: 13px; font-weight: 700; color: #6b7280; text-decoration: none; transition: color 0.2s; }
        .see-all:hover { color: #111827; }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }

        .product-card-wrap {
          position: relative;
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #f3f4f6;
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .product-card-wrap:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        }

        .discount-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          z-index: 5;
          background: #fbbf24;
          color: #111827;
          font-size: 12px;
          font-weight: 800;
          padding: 4px 8px;
          border-radius: 6px;
        }

        .spinner-wrap { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 60px 20px; }
        .spinner { width: 44px; height: 44px; border: 3px solid #e5e7eb; border-top-color: #111827; border-radius: 50%; animation: spin 0.9s linear infinite; }
        .spinner-text { font-size: 14px; color: #6b7280; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Features ── */
        .features-section { background: #fff; padding: 56px 20px; border-top: 1px solid #e5e7eb; }
        .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
        .feature-item { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .feature-icon { width: 56px; height: 56px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .feature-heading { font-size: 16px; font-weight: 700; color: #111827; }
        .feature-body { font-size: 14px; color: #6b7280; line-height: 1.6; }

        /* ── Footer ── */
        .footer { background: #111827; color: #d1d5db; padding: 48px 20px 0; }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1.5fr 1fr; gap: 40px; padding-bottom: 40px; border-bottom: 1px solid #374151; }
        .footer-logo { font-size: 22px; font-weight: 900; color: #fff; letter-spacing: -0.02em; margin-bottom: 10px; }
        .footer-tagline { font-size: 13px; line-height: 1.6; color: #9ca3af; }
        .footer-col-title { font-size: 13px; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 16px; }
        .footer-list { list-style: none; display: flex; flex-direction: column; gap: 12px; }
        .footer-list li { display: flex; align-items: flex-start; gap: 8px; font-size: 13px; line-height: 1.6; color: #9ca3af; }
        .footer-list li svg { flex-shrink: 0; margin-top: 2px; color: #6b7280; }
        .insta-link { display: inline-flex; align-items: center; gap: 8px; color: #9ca3af; text-decoration: none; font-size: 14px; font-weight: 600; transition: color 0.2s; }
        .insta-link:hover { color: #e879f9; }
        .footer-bottom { padding: 18px 0; text-align: center; font-size: 12px; color: #4b5563; }

        /* ── Responsive ── */
        @media (max-width: 640px) {
           .banner-bg-img { object-position: center top; }
        }
        @media (max-width: 900px) {
          .features-grid { grid-template-columns: 1fr 1fr; }
          .footer-grid { grid-template-columns: 1fr 1fr; }
          .banner-slide { height: 360px; }
          .banner-title { font-size: 36px; }
        }

        @media (max-width: 640px) {
          .banner-slide { height: 280px; padding: 0 48px 32px 20px; border-radius: 0 0 16px 16px; }
          .banner-title { font-size: 26px; }
          .banner-eyebrow { font-size: 11px; }
          .arrow { width: 28px; height: 28px; }
          .dots { bottom: 16px; right: 16px; }
          .features-grid { grid-template-columns: 1fr; }
          .footer-grid { grid-template-columns: 1fr; gap: 28px; }
          .products-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; }
          .section-title { font-size: 17px; }
        }
      `}</style>
    </div>
  )
}