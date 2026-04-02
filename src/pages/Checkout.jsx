import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import Navbar from '../components/Navbar'

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

  useEffect(() => {
    const fetchProduct = async () => {
      const snap = await getDoc(doc(db, 'products', id))
      if (snap.exists()) setProduct({ id: snap.id, ...snap.data() })
      else navigate('/products')
    }
    fetchProduct()
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

    const price = product.sellingPrice || product.actualPrice || product.price
    const address = [
      form.addressLine1, form.addressLine2,
      form.city, form.state, form.pincode
    ].filter(Boolean).join(', ')

    // Save order to sessionStorage
    sessionStorage.setItem('richcart_order', JSON.stringify({
      productId: product.id,
      productName: product.name,
      price,
      category: product.category,
      imageUrl: product.imageUrl,
      customerName: form.name.trim(),
      customerPhone: form.phone.trim(),
      altPhone: form.altPhone.trim(),
      addressLine1: form.addressLine1.trim(),
      addressLine2: form.addressLine2.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      pincode: form.pincode.trim(),
      address,
      paymentId: `mock_${Date.now()}`,
      orderId: `order_mock_${Date.now()}`,
    }))

    // Simulate payment processing delay
    setTimeout(() => {
      navigate('/payment-success')
    }, 1500)
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
    width: '100%', padding: '12px 14px',
    border: `1.5px solid ${errors[field] ? '#e94560' : '#e5e7eb'}`,
    borderRadius: '10px', fontSize: '14px', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit',
    color: '#111827', background: '#fff', transition: 'border-color 0.2s'
  })

  const labelStyle = { fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }

  const sectionTitle = (title) => (
    <h2 style={{
      fontSize: '13px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase',
      letterSpacing: '1px', margin: '0 0 16px', paddingBottom: '10px', borderBottom: '1px solid #f3f4f6'
    }}>{title}</h2>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <Navbar />
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

        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', margin: '0 0 24px', letterSpacing: '-0.02em' }}>Checkout</h1>

        {/* Product Summary */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '16px', marginBottom: '20px', display: 'flex', gap: '14px', alignItems: 'center' }}>
          <img src={product.imageUrl} alt={product.name} style={{ width: '64px', height: '64px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0, background: '#f3f4f6' }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 3px' }}>{product.category}</p>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</p>
            <p style={{ fontSize: '18px', fontWeight: 800, color: '#111827', margin: 0 }}>₹{Number(price).toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Personal Details */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '20px', marginBottom: '16px' }}>
          {sectionTitle('Personal Details')}
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Full Name *</label>
            <input type="text" placeholder="e.g. Mohammed Nawfal" value={form.name}
              onChange={e => set('name', e.target.value)} style={inputStyle('name')}
              onFocus={e => e.target.style.borderColor = '#111827'}
              onBlur={e => e.target.style.borderColor = errors.name ? '#e94560' : '#e5e7eb'} />
            {errors.name && <p style={{ color: '#e94560', fontSize: '12px', margin: '4px 0 0' }}>{errors.name}</p>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Mobile Number *</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', color: '#6b7280', fontWeight: 600 }}>+91</span>
                <input type="tel" placeholder="9876543210" value={form.phone} maxLength={10}
                  onChange={e => set('phone', e.target.value.replace(/\D/g, ''))}
                  style={{ ...inputStyle('phone'), paddingLeft: '44px' }}
                  onFocus={e => e.target.style.borderColor = '#111827'}
                  onBlur={e => e.target.style.borderColor = errors.phone ? '#e94560' : '#e5e7eb'} />
              </div>
              {errors.phone && <p style={{ color: '#e94560', fontSize: '12px', margin: '4px 0 0' }}>{errors.phone}</p>}
            </div>
            <div>
              <label style={labelStyle}>Alternate Number <span style={{ color: '#9ca3af', fontWeight: 400, fontSize: '12px' }}>(optional)</span></label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', color: '#6b7280', fontWeight: 600 }}>+91</span>
                <input type="tel" placeholder="9876543210" value={form.altPhone} maxLength={10}
                  onChange={e => set('altPhone', e.target.value.replace(/\D/g, ''))}
                  style={{ ...inputStyle('altPhone'), paddingLeft: '44px' }}
                  onFocus={e => e.target.style.borderColor = '#111827'}
                  onBlur={e => e.target.style.borderColor = errors.altPhone ? '#e94560' : '#e5e7eb'} />
              </div>
              {errors.altPhone && <p style={{ color: '#e94560', fontSize: '12px', margin: '4px 0 0' }}>{errors.altPhone}</p>}
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '20px', marginBottom: '16px' }}>
          {sectionTitle('Delivery Address')}
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Address Line 1 *</label>
            <input type="text" placeholder="House No., Building, Street" value={form.addressLine1}
              onChange={e => set('addressLine1', e.target.value)} style={inputStyle('addressLine1')}
              onFocus={e => e.target.style.borderColor = '#111827'}
              onBlur={e => e.target.style.borderColor = errors.addressLine1 ? '#e94560' : '#e5e7eb'} />
            {errors.addressLine1 && <p style={{ color: '#e94560', fontSize: '12px', margin: '4px 0 0' }}>{errors.addressLine1}</p>}
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Address Line 2 <span style={{ color: '#9ca3af', fontWeight: 400, fontSize: '12px' }}>(optional)</span></label>
            <input type="text" placeholder="Area, Landmark, Colony" value={form.addressLine2}
              onChange={e => set('addressLine2', e.target.value)} style={inputStyle('addressLine2')}
              onFocus={e => e.target.style.borderColor = '#111827'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={labelStyle}>City *</label>
              <input type="text" placeholder="e.g. Chennai" value={form.city}
                onChange={e => set('city', e.target.value)} style={inputStyle('city')}
                onFocus={e => e.target.style.borderColor = '#111827'}
                onBlur={e => e.target.style.borderColor = errors.city ? '#e94560' : '#e5e7eb'} />
              {errors.city && <p style={{ color: '#e94560', fontSize: '12px', margin: '4px 0 0' }}>{errors.city}</p>}
            </div>
            <div>
              <label style={labelStyle}>Pincode *</label>
              <input type="text" placeholder="e.g. 600001" value={form.pincode} maxLength={6}
                onChange={e => set('pincode', e.target.value.replace(/\D/g, ''))} style={inputStyle('pincode')}
                onFocus={e => e.target.style.borderColor = '#111827'}
                onBlur={e => e.target.style.borderColor = errors.pincode ? '#e94560' : '#e5e7eb'} />
              {errors.pincode && <p style={{ color: '#e94560', fontSize: '12px', margin: '4px 0 0' }}>{errors.pincode}</p>}
            </div>
          </div>
          <div>
            <label style={labelStyle}>State *</label>
            <select value={form.state} onChange={e => set('state', e.target.value)}
              style={{ ...inputStyle('state'), color: form.state ? '#111827' : '#9ca3af' }}
              onFocus={e => e.target.style.borderColor = '#111827'}
              onBlur={e => e.target.style.borderColor = errors.state ? '#e94560' : '#e5e7eb'}>
              <option value="">Select State</option>
              {['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
                'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
                'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
                'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
                'Uttarakhand','West Bengal','Andaman and Nicobar Islands','Chandigarh',
                'Dadra and Nagar Haveli','Daman and Diu','Delhi','Jammu and Kashmir',
                'Ladakh','Lakshadweep','Puducherry'
              ].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.state && <p style={{ color: '#e94560', fontSize: '12px', margin: '4px 0 0' }}>{errors.state}</p>}
          </div>
        </div>

        {/* Mock notice */}
        <div style={{
          background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px',
          padding: '12px 16px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center'
        }}>
          <span style={{ fontSize: '16px', flexShrink: 0 }}>🧪</span>
          <p style={{ fontSize: '13px', color: '#92400e', lineHeight: 1.5, margin: 0 }}>
            <strong>Test mode</strong> — no real payment. Click Pay to simulate a successful order.
          </p>
        </div>

        {/* Pay Button */}
        <button onClick={handlePay} disabled={paying} style={{
          width: '100%', padding: '16px',
          background: paying ? '#6b7280' : '#111827', color: '#fff',
          border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 700,
          cursor: paying ? 'not-allowed' : 'pointer', transition: 'background 0.2s',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
        }}>
          {paying ? (
            <>
              <div style={{ width: '18px', height: '18px', border: '2px solid #ffffff50', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              Processing...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" />
              </svg>
              Pay ₹{Number(price).toLocaleString('en-IN')}
            </>
          )}
        </button>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )
}