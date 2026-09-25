import './MerchantBadge.css'

export default function MerchantBadge({ reliability }) {
  const map = {
    high: { label: 'High', cls: 'high' },
    medium: { label: 'Medium', cls: 'medium' },
    low: { label: 'Low', cls: 'low' },
  }
  const r = map[reliability] || map.medium
  return <span className={`merchant-badge ${r.cls}`}>{r.label}</span>
}