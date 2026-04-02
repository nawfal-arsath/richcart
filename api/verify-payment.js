import crypto from 'crypto'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  } = req.body

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment fields' })
  }

  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    // Verify signature — this is the security check
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, error: 'Invalid payment signature' })
    }

    return res.status(200).json({ success: true, paymentId: razorpay_payment_id })

  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}