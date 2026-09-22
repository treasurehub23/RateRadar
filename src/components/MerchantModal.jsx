import { useEffect } from 'react'
import MerchantBadge from './MerchantBadge'
import './MerchantModal.css'

export default function MerchantModal({ route, onClose }) {
  useEffect(() => {
    const onEsc = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [onClose])

  if (!route) return null
  const m = route.merchant

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-top">
          <div className="modal-provider">
            <div className="provider-logo" style={{ background: '#111' }}>⬢</div>
            <div>
              <div className="provider-name">{route.provider}</div>
              <div className="provider-method">{route.method}</div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-amount-row">
          {route.bestRate && <span className="best-badge">Best Rate</span>}
          <div className="modal-amount">{route.received.toLocaleString()} {route.toCode || 'NGN'}</div>
          <div className="modal-sub">after fees</div>
          <MerchantBadge reliability={route.reliability} />
        </div>

        <div className="modal-stats">
          <div className="stat-row"><span>Completion Rate</span><strong>{m.completionRate}%</strong></div>
          <div className="stat-row"><span>Average Release Time</span><strong>{m.avgReleaseTime}</strong></div>
          <div className="stat-row"><span>Total Trades</span><strong>{m.totalTrades.toLocaleString()}</strong></div>
          <div className="stat-row"><span>Reviews</span><strong>{m.reviewScore} ★ ({m.reviewCount})</strong></div>
        </div>

        {m.advice && <div className="modal-advice">{m.advice}</div>}

        <div className="modal-actions">
          <button className="btn-outline">View on Binance</button>
          <button className="btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}