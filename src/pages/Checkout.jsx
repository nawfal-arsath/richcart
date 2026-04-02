import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import Navbar from '../components/Navbar'

const RAZORPAY_KEY_ID = 'rzp_test_SYYWe1vdKXpq9c'
const YOUR_WHATSAPP = '917010228720'
const YOUR_BUSINESS_NAME = 'RichCart'

// ── Razorpay SVG logo (official blue) ──────────────────────────────────────
function RazorpayLogo({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 38L20.5 10H30L25.5 28H36L18 48L22 34L14 38Z" fill="#ffffff" opacity="0.9" />
      <path d="M20.5 10L30 10L24 34L14 38L20.5 10Z" fill="#ffffff" />
    </svg>
  )
}

// ── Payment method pill ─────────────────────────────────────────────────────
function PayPill({ label }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.12)',
      border: '1px solid rgba(255,255,255,0.18)',
      borderRadius: '6px',
      padding: '3px 9px',
      fontSize: '10.5px',
      fontWeight: 700,
      color: 'rgba(255,255,255,0.82)',
      letterSpacing: '0.6px',
      whiteSpace: 'nowrap',
    }}>{label}</div>
  )
}

export default function Checkout() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [form, setForm] = useState({
    name: '', phone: '', altPhone: '',
    addressLine1: '', addressLine2: '',
    city: '', state: '', pincode: ''
  })
  const [errors, setErrors] = useState({})
  const [paying, setPaying] = useState(false)
  const [btnHover, setBtnHover] = useState(false)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)

    const fetchProduct = async () => {
      const snap = await getDoc(doc(db, 'products', id))
      if (snap.exists()) setProduct({ id: snap.id, ...snap.data() })
      else navigate('/products')
    }
    fetchProduct()

    return () => { if (document.body.contains(script)) document.body.removeChild(script) }
  }, [id, navigate])

  const set = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit mobile number'
    if (form.altPhone && !/^[6-9]\d{9}$/.test(form.altPhone)) e.altPhone = 'Enter a valid 10-digit number'
    if (!form.addressLine1.trim()) e.addressLine1 = 'Address is required'
    if (!form.city.trim()) e.city = 'City is required'
    if (!form.state.trim()) e.state = 'State is required'
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = 'Enter a valid 6-digit pincode'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handlePay = async () => {
    if (!validate()) return
    setPaying(true)

    try {
      const price = product.sellingPrice || product.actualPrice || product.price

      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: price, productName: product.name, customerName: form.name, customerPhone: form.phone })
      })
      const orderData = await orderRes.json()
      if (!orderData.orderId) throw new Error('Order creation failed')

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: 'INR',
        name: YOUR_BUSINESS_NAME,
        description: product.name,
        order_id: orderData.orderId,
        prefill: { name: form.name, contact: `+91${form.phone}` },
        theme: { color: '#111827' },

        handler: async function (response) {
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          })
          const verifyData = await verifyRes.json()

          if (verifyData.success) {
            const address = [form.addressLine1, form.addressLine2, form.city, form.state, form.pincode].filter(Boolean).join(', ')
            sessionStorage.setItem('richcart_order', JSON.stringify({
              productId: product.id, productName: product.name, price,
              category: product.category, imageUrl: product.imageUrl,
              customerName: form.name.trim(), customerPhone: form.phone.trim(),
              altPhone: form.altPhone.trim(), addressLine1: form.addressLine1.trim(),
              addressLine2: form.addressLine2.trim(), city: form.city.trim(),
              state: form.state.trim(), pincode: form.pincode.trim(), address,
              paymentId: response.razorpay_payment_id, orderId: response.razorpay_order_id,
            }))
            const ownerMsg =
              `🛒 *New Order - ${YOUR_BUSINESS_NAME}*\n\n` +
              `━━━━━━━━━━━━━━━━━━━━\n📦 *PRODUCT DETAILS*\n━━━━━━━━━━━━━━━━━━━━\n` +
              `Product: ${product.name}\nCategory: ${product.category}\nAmount Paid: ₹${Number(price).toLocaleString('en-IN')}\n\n` +
              `━━━━━━━━━━━━━━━━━━━━\n👤 *CUSTOMER DETAILS*\n━━━━━━━━━━━━━━━━━━━━\n` +
              `Name: ${form.name}\nMobile: +91 ${form.phone}\n` +
              (form.altPhone ? `Alternate: +91 ${form.altPhone}\n` : '') +
              `\n━━━━━━━━━━━━━━━━━━━━\n📍 *DELIVERY ADDRESS*\n━━━━━━━━━━━━━━━━━━━━\n${address}\n\n` +
              `💳 *Payment ID:* ${response.razorpay_payment_id}\n✅ *Payment verified & confirmed by Razorpay.*`
            window.open(`https://wa.me/${YOUR_WHATSAPP}?text=${encodeURIComponent(ownerMsg)}`, '_blank')
            navigate('/payment-success')
          } else {
            alert('Payment verification failed. Please contact support.')
            setPaying(false)
          }
        },
        modal: { ondismiss: () => setPaying(false) }
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', (response) => {
        alert(`Payment failed: ${response.error.description}`)
        setPaying(false)
      })
      rzp.open()

    } catch (err) {
      console.error(err)
      alert('Something went wrong. Please try again.')
      setPaying(false)
    }
  }

  if (!product) return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 20px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #f3f4f6', borderTopColor: '#111827', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  const price = product.sellingPrice || product.actualPrice || product.price

  const inputStyle = (field) => ({
    width: '100%', padding: '13px 14px',
    border: `1.5px solid ${errors[field] ? '#ef4444' : '#e5e7eb'}`,
    borderRadius: '10px', fontSize: '14px', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit',
    color: '#111827', background: '#fff',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  })

  const labelStyle = {
    fontSize: '12px', fontWeight: 700, color: '#374151',
    display: 'block', marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.6px'
  }

  const sectionTitle = (icon, title) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid #f3f4f6' }}>
      <div style={{ width: '28px', height: '28px', background: '#f3f4f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.8px', margin: 0 }}>{title}</h2>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <Navbar />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes btnShimmer {
          0% { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(300%) skewX(-20deg); }
        }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(17,24,39,0.25); }
          70% { box-shadow: 0 0 0 10px rgba(17,24,39,0); }
          100% { box-shadow: 0 0 0 0 rgba(17,24,39,0); }
        }
        input:focus, select:focus {
          border-color: #111827 !important;
          box-shadow: 0 0 0 3px rgba(17,24,39,0.06) !important;
        }
        input::placeholder { color: #c4c9d4; }
        .pay-btn-shimmer {
          position: absolute;
          top: 0; left: 0;
          width: 40%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.09), transparent);
          transform: translateX(-100%) skewX(-20deg);
          pointer-events: none;
        }
        .pay-btn:hover .pay-btn-shimmer {
          animation: btnShimmer 0.7s ease forwards;
        }
      `}</style>

      <div style={{ maxWidth: '520px', margin: '40px auto', padding: '0 20px 80px' }}>

        <button onClick={() => navigate(`/product/${product.id}`)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '8px',
          color: '#6b7280', fontSize: '14px', fontWeight: 600, marginBottom: '24px', padding: 0
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#111827', margin: '0 0 24px', letterSpacing: '-0.02em' }}>Checkout</h1>

        {/* Product Summary */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '16px', marginBottom: '20px', display: 'flex', gap: '14px', alignItems: 'center' }}>
          <img src={product.imageUrl} alt={product.name} style={{ width: '68px', height: '68px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0, background: '#f3f4f6', border: '1px solid #f3f4f6' }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '11px', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 3px' }}>{product.category}</p>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: '0 0 5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</p>
            <p style={{ fontSize: '20px', fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.01em' }}>₹{Number(price).toLocaleString('en-IN')}</p>
          </div>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '6px 10px', flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
        </div>

        {/* Personal Details */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '20px', marginBottom: '14px' }}>
          {sectionTitle(
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
            'Personal Details'
          )}
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Full Name <span style={{ color: '#ef4444' }}>*</span></label>
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              style={inputStyle('name')}
            />
            {errors.name && <p style={{ color: '#ef4444', fontSize: '12px', margin: '5px 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
              {errors.name}
            </p>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Mobile <span style={{ color: '#ef4444' }}>*</span></label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', color: '#374151', fontWeight: 700, userSelect: 'none' }}>+91</span>
                <input
                  type="tel"
                  placeholder="Your number"
                  value={form.phone}
                  maxLength={10}
                  onChange={e => set('phone', e.target.value.replace(/\D/g, ''))}
                  style={{ ...inputStyle('phone'), paddingLeft: '46px' }}
                />
              </div>
              {errors.phone && <p style={{ color: '#ef4444', fontSize: '12px', margin: '5px 0 0' }}>{errors.phone}</p>}
            </div>
            <div>
              <label style={labelStyle}>Alternate <span style={{ color: '#9ca3af', fontWeight: 500, fontSize: '11px', textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', color: '#374151', fontWeight: 700, userSelect: 'none' }}>+91</span>
                <input
                  type="tel"
                  placeholder="Alternate number"
                  value={form.altPhone}
                  maxLength={10}
                  onChange={e => set('altPhone', e.target.value.replace(/\D/g, ''))}
                  style={{ ...inputStyle('altPhone'), paddingLeft: '46px' }}
                />
              </div>
              {errors.altPhone && <p style={{ color: '#ef4444', fontSize: '12px', margin: '5px 0 0' }}>{errors.altPhone}</p>}
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '20px', marginBottom: '14px' }}>
          {sectionTitle(
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>,
            'Delivery Address'
          )}

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Address Line 1 <span style={{ color: '#ef4444' }}>*</span></label>
            <input
              type="text"
              placeholder="House / Flat No., Building name, Street"
              value={form.addressLine1}
              onChange={e => set('addressLine1', e.target.value)}
              style={inputStyle('addressLine1')}
            />
            {errors.addressLine1 && <p style={{ color: '#ef4444', fontSize: '12px', margin: '5px 0 0' }}>{errors.addressLine1}</p>}
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Address Line 2 <span style={{ color: '#9ca3af', fontWeight: 500, fontSize: '11px', textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
            <input
              type="text"
              placeholder="Area, Locality, Landmark (e.g. Near Apollo Hospital)"
              value={form.addressLine2}
              onChange={e => set('addressLine2', e.target.value)}
              style={inputStyle('addressLine2')}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={labelStyle}>City <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                type="text"
                placeholder="e.g. Chennai"
                value={form.city}
                onChange={e => set('city', e.target.value)}
                style={inputStyle('city')}
              />
              {errors.city && <p style={{ color: '#ef4444', fontSize: '12px', margin: '5px 0 0' }}>{errors.city}</p>}
            </div>
            <div>
              <label style={labelStyle}>Pincode <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                type="text"
                placeholder="e.g. 600 001"
                value={form.pincode}
                maxLength={6}
                onChange={e => set('pincode', e.target.value.replace(/\D/g, ''))}
                style={inputStyle('pincode')}
              />
              {errors.pincode && <p style={{ color: '#ef4444', fontSize: '12px', margin: '5px 0 0' }}>{errors.pincode}</p>}
            </div>
          </div>

          <div>
            <label style={labelStyle}>State <span style={{ color: '#ef4444' }}>*</span></label>
            <div style={{ position: 'relative' }}>
              <select
                value={form.state}
                onChange={e => set('state', e.target.value)}
                style={{ ...inputStyle('state'), color: form.state ? '#111827' : '#c4c9d4', appearance: 'none', paddingRight: '36px', cursor: 'pointer' }}
              >
                <option value="">Select your state</option>
                {['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
                  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
                  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
                  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
                  'Uttarakhand','West Bengal','Andaman and Nicobar Islands','Chandigarh',
                  'Dadra and Nagar Haveli','Daman and Diu','Delhi','Jammu and Kashmir',
                  'Ladakh','Lakshadweep','Puducherry'
                ].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <svg style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
            {errors.state && <p style={{ color: '#ef4444', fontSize: '12px', margin: '5px 0 0' }}>{errors.state}</p>}
          </div>
        </div>

        {/* ── Premium Pay Button ───────────────────────────────────────────── */}
        <div style={{ marginTop: '8px' }}>

          {/* Top security note */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '12px' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>
              256-bit SSL encrypted · Powered by Razorpay
            </span>
          </div>

          {/* The button */}
          <button
            className="pay-btn"
            onClick={handlePay}
            disabled={paying}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            style={{
              position: 'relative',
              width: '100%',
              border: 'none',
              borderRadius: '14px',
              cursor: paying ? 'not-allowed' : 'pointer',
              overflow: 'hidden',
              padding: 0,
              background: 'transparent',
              transform: btnHover && !paying ? 'translateY(-2px)' : 'translateY(0)',
              transition: 'transform 0.18s ease, box-shadow 0.2s ease',
              boxShadow: btnHover && !paying
                ? '0 10px 40px rgba(17,24,39,0.32), 0 2px 8px rgba(17,24,39,0.16)'
                : '0 4px 20px rgba(17,24,39,0.22), 0 1px 4px rgba(17,24,39,0.1)',
            }}
          >
            {/* Shimmer */}
            <div className="pay-btn-shimmer" />

            {/* Main gradient background */}
            <div style={{
              background: paying
                ? 'linear-gradient(135deg, #4b5563, #6b7280)'
                : 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #111827 100%)',
              borderRadius: '14px',
              padding: '0',
            }}>

              {/* Top section: amount + label */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '18px 22px',
              }}>
                {/* Left: icon */}
                <div style={{ flexShrink: 0 }}>
                  {paying ? (
                    <div style={{ width: '22px', height: '22px', border: '2.5px solid rgba(255,255,255,0.25)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  ) : (
                    <RazorpayLogo size={22} />
                  )}
                </div>

                {/* Middle: Pay label + subtitle */}
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                    {paying ? 'Opening Payment...' : `Pay ₹${Number(price).toLocaleString('en-IN')}`}
                  </div>
                  {!paying && (
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: 500, marginTop: '2px' }}>
                      via Razorpay · Secure Checkout
                    </div>
                  )}
                </div>

                {/* Right: Arrow */}
                {!paying && (
                  <div style={{
                    width: '38px', height: '38px', flexShrink: 0,
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>


            </div>
          </button>

          {/* Below button trust row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginTop: '14px' }}>
            {[
              { icon: '🔒', text: 'Safe & Secure' },
              { icon: '⚡', text: 'Instant Confirm' },
              { icon: '🚚', text: '5–7 Day Delivery' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11.5px', color: '#9ca3af', fontWeight: 600 }}>
                <span style={{ fontSize: '13px' }}>{icon}</span>
                {text}
              </div>
            ))}
          </div>

        </div>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )
}