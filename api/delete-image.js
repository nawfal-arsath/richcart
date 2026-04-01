import crypto from 'crypto'

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { publicId } = req.body

  if (!publicId) {
    return res.status(400).json({ error: 'publicId is required' })
  }

  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    // Generate signature (required by Cloudinary)
    const timestamp = Math.round(new Date().getTime() / 1000)
    const signature = crypto
      .createHash('sha1')
      .update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
      .digest('hex')

    // Call Cloudinary delete API
    const formData = new URLSearchParams()
    formData.append('public_id', publicId)
    formData.append('timestamp', timestamp)
    formData.append('api_key', apiKey)
    formData.append('signature', signature)

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      { method: 'POST', body: formData }
    )

    const data = await response.json()

    if (data.result === 'ok') {
      return res.status(200).json({ success: true })
    } else {
      return res.status(400).json({ error: 'Cloudinary delete failed', data })
    }
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}