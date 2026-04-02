import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const YOUR_WHATSAPP = '917010228720'
const YOUR_BUSINESS_NAME = 'RichCart'

export default function PaymentSuccess() {
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [step, setStep] = useState('sending') // 'sending' | 'done'

  useEffect(() => {
    const raw = sessionStorage.getItem('richcart_order')
    if (!raw) { navigate('/products'); return }
    const data = JSON.parse(raw)
    setOrder(data)

    // Step 1: Send WhatsApp to YOU (owner) immediately
    const ownerMsg =
      `🛒 *New Order - ${YOUR_BUSINESS_NAME}*\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `📦 *PRODUCT DETAILS*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `Product: ${data.productName}\n` +
      `Category: ${data.category}\n` +
      `Amount Paid: ₹${Number(data.price).toLocaleString('en-IN')}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *CUSTOMER DETAILS*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `Name: ${data.customerName}\n` +
      `Mobile: +91 ${data.customerPhone}\n` +
      (data.altPhone ? `Alternate: +91 ${data.altPhone}\n` : '') +
      `\n━━━━━━━━━━━━━━━━━━━━\n` +
      `📍 *DELIVERY ADDRESS*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `${data.address}\n\n` +
      `💳 *Payment ID:* ${data.paymentId}\n` +
      `✅ *Payment confirmed.*`

    window.open(
      `https://wa.me/${YOUR_WHATSAPP}?text=${encodeURIComponent(ownerMsg)}`,
      '_blank'
    )

    // Step 2: After 2 seconds, send WhatsApp to CUSTOMER
    setTimeout(() => {
      const customerMsg =
        `✅ *Order Confirmed - ${YOUR_BUSINESS_NAME}*\n\n` +
        `Hi ${data.customerName}! Your order has been confirmed.\n\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `📦 *ORDER DETAILS*\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `Product: ${data.productName}\n` +
        `Category: ${data.category}\n` +
        `Amount Paid: ₹${Number(data.price).toLocaleString('en-IN')}\n\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `📍 *DELIVERY ADDRESS*\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `${data.address}\n\n` +
        `💳 Payment ID: ${data.paymentId}\n\n` +
        `🚚 *Estimated Delivery: 5–7 working days*\n\n` +
        `Thank you for shopping with ${YOUR_BUSINESS_NAME}! For any queries reply to this message.`

      window.open(
        `https://wa.me/91${data.customerPhone}?text=${encodeURIComponent(customerMsg)}`,
        '_blank'
      )

      setStep('done')
      sessionStorage.removeItem('richcart_order')
    }, 2000)

  }, [navigate])

  if (!order) return null

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <Navbar />
      <div style={{ maxWidth: '480px', margin: '40px auto', padding: '0 20px 60px' }}>

        {/* Success Icon */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '88px', height: '88px', borderRadius: '50%',
            background: '#dcfce7', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 20px',
            boxShadow: '0 0 0 12px #f0fdf4'
          }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#111827', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
            Payment Successful!
          </h1>
          <p style={{ color: '#6b7280', fontSize: '15px', margin: 0, lineHeight: 1.6 }}>
            {step === 'sending'
              ? 'Sending order details on WhatsApp...'
              : 'Order confirmed! WhatsApp sent to you and the customer.'}
          </p>
        </div>

        {/* WhatsApp sending status */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '20px', marginBottom: '16px' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 14px', paddingBottom: '10px', borderBottom: '1px solid #f3f4f6' }}>
            WhatsApp Status
          </p>

          {/* Owner message */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
              background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0 }}>Order details sent to you</p>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>+91 {YOUR_WHATSAPP.slice(2)}</p>
            </div>
          </div>

          {/* Customer message */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
              background: step === 'done' ? '#dcfce7' : '#f3f4f6',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.4s'
            }}>
              {step === 'done' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : (
                <div style={{ width: '14px', height: '14px', border: '2px solid #d1d5db', borderTopColor: '#6b7280', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              )}
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0 }}>
                {step === 'done' ? 'Confirmation sent to customer' : 'Sending confirmation to customer...'}
              </p>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>+91 {order.customerPhone}</p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '20px', marginBottom: '16px' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 14px', paddingBottom: '10px', borderBottom: '1px solid #f3f4f6' }}>
            Order Summary
          </p>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f3f4f6' }}>
            <img src={order.imageUrl} alt={order.productName}
              style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover', background: '#f3f4f6', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: '0 0 3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{order.productName}</p>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{order.category}</p>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#111827', flexShrink: 0 }}>
              ₹{Number(order.price).toLocaleString('en-IN')}
            </div>
          </div>

          <Row label="Name" value={order.customerName} />
          <Row label="Mobile" value={`+91 ${order.customerPhone}`} />
          {order.altPhone && <Row label="Alternate" value={`+91 ${order.altPhone}`} />}
          <Row label="Payment ID" value={order.paymentId} valueColor="#6b7280" small />

          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 6px' }}>Delivery Address</p>
            <p style={{ fontSize: '13px', color: '#111827', lineHeight: 1.6, margin: 0 }}>{order.address}</p>
          </div>
        </div>

        {/* Delivery info */}
        <div style={{
          background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px',
          padding: '12px 16px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center'
        }}>
          <span style={{ fontSize: '20px', flexShrink: 0 }}>🚚</span>
          <p style={{ fontSize: '13px', color: '#1d4ed8', lineHeight: 1.5, margin: 0 }}>
            <strong>Estimated Delivery: 5–7 working days.</strong>
          </p>
        </div>

        <Link to="/products" style={{
          display: 'block', textAlign: 'center',
          color: '#6b7280', fontSize: '14px', fontWeight: 600,
          textDecoration: 'none'
        }}>
          Continue Shopping →
        </Link>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function Row({ label, value, valueColor = '#111827', small = false }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', gap: '12px' }}>
      <span style={{ fontSize: '13px', color: '#6b7280', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: small ? '11px' : '13px', fontWeight: 600, color: valueColor, textAlign: 'right', wordBreak: 'break-all' }}>{value}</span>
    </div>
  )
}