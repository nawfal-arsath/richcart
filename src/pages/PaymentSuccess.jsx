import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const YOUR_WHATSAPP = '917010228720'
const YOUR_BUSINESS_NAME = 'RichCart'

export default function PaymentSuccess() {
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [customerSent, setCustomerSent] = useState(false)

  useEffect(() => {
    const raw = sessionStorage.getItem('richcart_order')
    if (!raw) { navigate('/products'); return }
    const data = JSON.parse(raw)
    setOrder(data)

    // Auto-send YOUR message (owner) — first window.open, browser allows it
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

    sessionStorage.removeItem('richcart_order')
  }, [navigate])

  const sendCustomerConfirmation = () => {
    if (!order) return

    const customerMsg =
      `✅ *Order Confirmed - ${YOUR_BUSINESS_NAME}*\n\n` +
      `Hi ${order.customerName}! Your order has been confirmed.\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `📦 *ORDER DETAILS*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `Product: ${order.productName}\n` +
      `Amount Paid: ₹${Number(order.price).toLocaleString('en-IN')}\n\n` +
      `📍 *Delivering to:*\n` +
      `${order.address}\n\n` +
      `🚚 *Estimated Delivery: 5–7 working days*\n\n` +
      `Thank you for shopping with ${YOUR_BUSINESS_NAME}! For any queries reply to this message.`

    window.open(
      `https://wa.me/91${order.customerPhone}?text=${encodeURIComponent(customerMsg)}`,
      '_blank'
    )
    setCustomerSent(true)
  }

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
            Your order is placed. Tap below to get your confirmation on WhatsApp.
          </p>
        </div>

        {/* Order card — only customer-relevant info, NO owner details */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '20px', marginBottom: '16px' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 14px', paddingBottom: '10px', borderBottom: '1px solid #f3f4f6' }}>
            Your Order
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

        {/* Customer confirmation button */}
        {!customerSent ? (
          <button
            onClick={sendCustomerConfirmation}
            style={{
              width: '100%', padding: '16px',
              background: '#16a34a', color: '#fff',
              border: 'none', borderRadius: '12px',
              fontSize: '16px', fontWeight: 700,
              cursor: 'pointer', transition: 'background 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              marginBottom: '12px'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#15803d'}
            onMouseLeave={e => e.currentTarget.style.background = '#16a34a'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.103 1.523 5.83L.057 23.077a.75.75 0 0 0 .866.866l5.247-1.466A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.693-.513-5.228-1.407l-.374-.22-3.876 1.083 1.083-3.876-.22-.374A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
            </svg>
            Get Order Confirmation on WhatsApp
          </button>
        ) : (
          <div style={{ background: '#dcfce7', borderRadius: '12px', padding: '14px 16px', marginBottom: '12px', textAlign: 'center' }}>
            <p style={{ color: '#15803d', fontWeight: 600, fontSize: '14px', margin: 0 }}>
              ✓ Confirmation sent to your WhatsApp!
            </p>
          </div>
        )}

        <Link to="/products" style={{
          display: 'block', textAlign: 'center',
          color: '#6b7280', fontSize: '14px', fontWeight: 600,
          textDecoration: 'none', marginTop: '8px'
        }}>
          Continue Shopping →
        </Link>
      </div>
    </div>
  )
}

function Row({ label, value, valueColor = '#111827' }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', gap: '12px' }}>
      <span style={{ fontSize: '13px', color: '#6b7280', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: '13px', fontWeight: 600, color: valueColor, textAlign: 'right' }}>{value}</span>
    </div>
  )
}