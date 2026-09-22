import { useEffect, useState } from 'react'
import { getAlerts } from '../api'
import './Alerts.css'

const severityIcon = { high: '⚠️', medium: '⚠️', info: 'ℹ️', success: '✓' }

export default function Alerts() {
  const [alerts, setAlerts] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => { getAlerts().then(setAlerts) }, [])

  const filtered = filter === 'all' ? alerts : alerts.filter((a) => a.type === filter)

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>🔔 Rate Transparency Alerts</h1>
          <p>We monitor for unusual rate spreads, hidden fees and important changes so you don't lose money.</p>
        </div>
      </div>

      <div className="filter-tabs">
        {['all', 'rate-spread', 'fee-change', 'reliability'].map((f) => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f === 'rate-spread' ? 'Rate Spread' : f === 'fee-change' ? 'Fee Change' : 'Reliability'}
          </button>
        ))}
      </div>

      <div className="alerts-list">
        {filtered.map((a) => (
          <div key={a.id} className={`alert-item ${a.severity}`}>
            <div className="alert-icon">{severityIcon[a.severity]}</div>
            <div className="alert-content">
              <div className="alert-title">{a.title}</div>
              <div className="alert-body">{a.body}</div>
            </div>
            <div className="alert-time">{a.time}</div>
          </div>
        ))}
      </div>

      <div className="alert-threshold">
        <h3>🔔 Rate Alert Threshold</h3>
        <p>Get notified when the rate spread is more than:</p>
        <div className="threshold-row">
          <input type="range" min="1" max="20" defaultValue="5" />
          <span className="threshold-value">5%</span>
          <button className="btn-primary">Update</button>
        </div>
      </div>
    </div>
  )
}