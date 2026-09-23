import { useEffect, useState } from 'react'
import { getAlerts } from '../api'
import './Alerts.css'

const SEVERITY = {
  high:    { icon: '⚠',  cls: 'high' },
  medium:  { icon: '⚠',  cls: 'medium' },
  info:    { icon: 'ℹ',  cls: 'info' },
  success: { icon: '✓',  cls: 'success' },
}

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'rate-spread', label: 'Rate Spread' },
  { key: 'fee-change', label: 'Fee Change' },
  { key: 'reliability', label: 'Reliability' },
]

export default function Alerts() {
  const [alerts, setAlerts] = useState([])
  const [filter, setFilter] = useState('all')
  const [threshold, setThreshold] = useState(() => {
    return Number(localStorage.getItem('alert_threshold') || 5)
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => { getAlerts().then(setAlerts) }, [])

  const handleUpdate = () => {
    localStorage.setItem('alert_threshold', threshold)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const filtered = filter === 'all' ? alerts : alerts.filter((a) => a.type === filter)

  return (
    <div>
      <div className="page-header">
        <h1>🔔 Rate Transparency Alerts</h1>
        <p>We monitor for unusual rate spreads, hidden fees and important changes so you don't lose money.</p>
      </div>

      <div className="filter-tabs">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`filter-tab ${filter === f.key ? 'active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="alerts-list">
        {filtered.map((a) => {
          const sev = SEVERITY[a.severity] || SEVERITY.info
          return (
            <div key={a.id} className="alert-row">
              <span className={`alert-icon ${sev.cls}`}>{sev.icon}</span>
              <div className="alert-content">
                <div className="alert-title">{a.title}</div>
                <div className="alert-body">{a.body}</div>
              </div>
              <div className="alert-time">{a.time}</div>
            </div>
          )
        })}
      </div>

      <div className="alert-threshold">
        <h3>⚠ Rate Alert Threshold</h3>
        <p>Get notified when the rate spread is more than:</p>
        <div className="threshold-row">
          <input
            type="range"
            min="1"
            max="20"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
          />
          <span className="threshold-value">{threshold}%</span>
          <button className="btn-primary" onClick={handleUpdate}>
            {saved ? 'Saved ✓' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  )
}