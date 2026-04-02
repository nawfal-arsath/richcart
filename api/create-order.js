export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { amount, productName, customerName, customerPhone } = req.body

  if (!amount || !productName) {
    return res.status(400).json({ error: 'amount and productName are required' })
  }

  try {
    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64')
      },
      body: JSON.stringify({
        amount: Math.round(Number(amount) * 100), // paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: {
          productName,
          customerName: customerName || '',
          customerPhone: customerPhone || ''
        }
      })
    })

    const data = await response.json()

    if (data.id) {
      return res.status(200).json({ orderId: data.id, amount: data.amount })
    } else {
      console.error('Razorpay order error:', data)
      return res.status(400).json({ error: 'Failed to create order', data })
    }
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}