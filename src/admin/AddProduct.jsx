import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { Link } from 'react-router-dom'

const CATEGORIES = ['Mobile', 'Laptop', 'Tablet', 'Case', 'Accessories', 'AC', 'Others']

const CLOUDINARY_CLOUD_NAME = 'dknpv11pw'
const CLOUDINARY_UPLOAD_PRESET = 'richcart_preset'

export default function AddProduct() {
  const [form, setForm] = useState({
    name: '', category: 'Mobile',
    actualPrice: '', sellingPrice: '', description: ''
  })
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Auto-calculate discount %
  const discountPercent = form.actualPrice && form.sellingPrice
    ? Math.round(((form.actualPrice - form.sellingPrice) / form.actualPrice) * 100)
    : 0

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!image) return alert('Please select an image')
    if (Number(form.sellingPrice) > Number(form.actualPrice)) {
      return alert('Selling price cannot be more than actual price')
    }
    setUploading(true)
    setError('')
    setProgress(30)

    try {
      const formData = new FormData()
      formData.append('file', image)
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      )

      setProgress(70)
      const data = await res.json()
      if (!data.secure_url) throw new Error('Upload failed')
      setProgress(90)

      await addDoc(collection(db, 'products'), {
        name: form.name,
        category: form.category,
        description: form.description,
        actualPrice: Number(form.actualPrice),
        sellingPrice: Number(form.sellingPrice),
        discountPercent: discountPercent > 0 ? discountPercent : null,
        imageUrl: data.secure_url,
        imagePublicId: data.public_id,
        sold: false,
        createdAt: serverTimestamp()
      })

      setProgress(100)
      setUploading(false)
      setSuccess(true)
      setForm({ name: '', category: 'Mobile', actualPrice: '', sellingPrice: '', description: '' })
      setImage(null)
      setPreview(null)
      setTimeout(() => { setSuccess(false); setProgress(0) }, 3000)

    } catch (err) {
      console.error(err)
      setError('Upload failed. Check your Cloudinary config.')
      setUploading(false)
      setProgress(0)
    }
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', border: '1px solid #e8e8e8',
    borderRadius: '8px', fontSize: '14px', outline: 'none', marginTop: '6px'
  }
  const labelStyle = { fontSize: '13px', fontWeight: 500, color: '#555', display: 'block' }

  return (
    <div style={{ minHeight: '100vh', background: '#f9f9f9' }}>
      <div style={{
        background: '#fff', padding: '0 32px', height: '64px',
        display: 'flex', alignItems: 'center', gap: '16px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
      }}>
        <Link to="/admin/dashboard" style={{ fontSize: '13px', color: '#e94560', fontWeight: 600 }}>← Back</Link>
        <span style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a2e' }}>Add New Product</span>
      </div>

      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 24px' }}>
        <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
          <form onSubmit={handleSubmit}>

            {/* Image Upload */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Product Image</label>
              <div
                style={{
                  border: '2px dashed #e8e8e8', borderRadius: '12px',
                  padding: '24px', textAlign: 'center',
                  marginTop: '6px', cursor: 'pointer', transition: 'border-color 0.2s'
                }}
                onClick={() => document.getElementById('imgInput').click()}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#e94560'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#e8e8e8'}
              >
                {preview
                  ? <img src={preview} alt="preview" style={{ maxHeight: '200px', maxWidth: '100%', borderRadius: '8px', objectFit: 'cover' }} />
                  : (
                    <div>
                      <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '4px' }}>Click to upload image</p>
                      <p style={{ color: '#ccc', fontSize: '12px' }}>JPG, PNG, WEBP supported</p>
                    </div>
                  )
                }
                <input id="imgInput" type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Product Name</label>
              <input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. iPhone 15 Pro Max" required />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Category</label>
              <select style={inputStyle} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Pricing section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Actual Price (₹)</label>
                <input
                  type="number" style={inputStyle}
                  value={form.actualPrice}
                  onChange={e => setForm({ ...form, actualPrice: e.target.value })}
                  placeholder="e.g. 85000" required
                />
              </div>
              <div>
                <label style={labelStyle}>Selling Price (₹)</label>
                <input
                  type="number" style={inputStyle}
                  value={form.sellingPrice}
                  onChange={e => setForm({ ...form, sellingPrice: e.target.value })}
                  placeholder="e.g. 72000" required
                />
              </div>
            </div>

            {/* Live discount preview */}
            {discountPercent > 0 && (
              <div style={{
                background: '#e8f8ed', borderRadius: '8px',
                padding: '10px 14px', marginBottom: '16px',
                fontSize: '13px', color: '#1a7a42', fontWeight: 600
              }}>
                🏷 {discountPercent}% discount will be shown to customers
              </div>
            )}

            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Description</label>
              <textarea rows={4} style={{ ...inputStyle, resize: 'vertical' }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the product, condition, specs..." required />
            </div>

            {uploading && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ background: '#e8e8e8', borderRadius: '50px', height: '6px', overflow: 'hidden' }}>
                  <div style={{ background: '#e94560', height: '100%', width: `${progress}%`, transition: 'width 0.4s ease' }} />
                </div>
                <p style={{ fontSize: '12px', color: '#888', marginTop: '6px' }}>
                  {progress < 70 ? 'Uploading image...' : progress < 100 ? 'Saving product...' : 'Done!'}
                </p>
              </div>
            )}

            {success && (
              <div style={{ background: '#e8f8ed', color: '#1a7a42', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', fontWeight: 500 }}>
                ✓ Product added successfully!
              </div>
            )}

            {error && (
              <div style={{ background: '#ffeaea', color: '#e94560', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
                ⚠ {error}
              </div>
            )}

            <button type="submit" disabled={uploading} style={{
              width: '100%', background: uploading ? '#aaa' : '#1a1a2e',
              color: '#fff', padding: '12px', borderRadius: '8px',
              border: 'none', fontSize: '14px', fontWeight: 600
            }}>
              {uploading ? `Uploading... ${progress}%` : 'Add Product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}