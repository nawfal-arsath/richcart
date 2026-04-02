const CATEGORIES = ['All', 'Mobile', 'Toys', 'Footwear', 'Accessories', 'Watches', 'Others']

export default function CategoryFilter({ active, onChange }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
        gap: '10px',
        margin: '24px 0'
      }}
    >
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          style={{
            padding: '8px 12px',
            borderRadius: '50px',
            border: active === cat ? 'none' : '1px solid #e8e8e8',
            background: active === cat ? '#1a1a2e' : '#fff',
            color: active === cat ? '#fff' : '#555',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
            width: '100%'
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}