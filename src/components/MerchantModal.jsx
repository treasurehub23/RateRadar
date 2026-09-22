import { X, Info, ExternalLink, Clock, CheckCircle, Users, Star } from 'lucide-react'
import './MerchantModal.css'

function BinanceLogo() {
  return (
    <svg viewBox="0 0 126.61 126.61" width="22" height="22" fill="#F0B90B">
      <path d="M38.73 53.2 63.3 28.63 87.9 53.2l14.24-14.24L63.3 0 24.49 38.95zM0 63.3l14.24-14.24L28.48 63.3 14.24 77.54zm38.73 10.11L63.3 97.97l24.6-24.56 14.26 14.21-.02.02L63.3 126.61 24.49 87.66l-.02-.02zM98.13 63.3l14.24-14.24 14.24 14.24-14.24 14.24z"/>
      <path d="M77.85 63.28h.02L63.3 48.73 52.68 59.34l-1.22 1.22-2.86 2.85-.02.02.02.02L63.3 77.85l14.57-14.55.02-.02z"/>
    </svg>
  )
}

export default function MerchantModal({ route, onClose }) {
  if (!route) return null

  const reliability = route.reliability || 'medium'
  const reliabilityColor = {
    high: { bg: '#D1FAE5', color: '#047857' },
    medium: { bg: '#FEF3C7', color: '#B45309' },
    low: { bg: '#FEE2E2', color: '#B91C1C' },
  }[reliability]

  const reliabilityPct = { high: 92, medium: 68, low: 41 }[reliability]

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="modal-provider-head">
          <div className="modal-provider-logo"><BinanceLogo /></div>
          <div>
            <div className="modal-provider-name">{route.provider}</div>
            <div className="modal-provider-method">{route.method}</div>
          </div>
        </div>

        <div className="modal-body">
          <div>
            <div className="modal-receive-label">You'll Receive</div>
            <div className="modal-receive-amount">{route.received.toLocaleString()} NGN</div>
            <div className="modal-receive-note">after fees</div>
          </div>
          <div className="modal-side">
            {route.bestRate && <span className="best-badge">Best Rate</span>}
            <div className="reliability-box" style={{ background: reliabilityColor.bg }}>
              <div className="reliability-box-label">Reliability Score</div>
              <div className="reliability-box-value" style={{ color: reliabilityColor.color }}>
                {reliability.toUpperCase()}
              </div>
              <div className="reliability-box-pct" style={{ color: reliabilityColor.color }}>
                ({reliabilityPct}%)
              </div>
            </div>
          </div>
        </div>

        <div className="modal-details-title">Merchant Details</div>

        <div className="modal-details">
          <div className="detail-row">
            <span className="detail-row-label"><CheckCircle size={15} /> Completion Rate</span>
            <span className="detail-row-value">{reliabilityPct}%</span>
          </div>
          <div className="detail-row">
            <span className="detail-row-label"><Clock size={15} /> Average Release Time</span>
            <span className="detail-row-value">7 min</span>
          </div>
          <div className="detail-row">
            <span className="detail-row-label"><Users size={15} /> Total Trades</span>
            <span className="detail-row-value">1,248</span>
          </div>
          <div className="detail-row">
            <span className="detail-row-label"><Star size={15} /> Reviews</span>
            <span className="detail-row-value">4.2 ★ (312)</span>
          </div>
        </div>

        <div className="modal-note">
          <Info size={16} className="modal-note-icon" />
          <span>
            This merchant has a {reliability} reliability score. Consider {reliability === 'high' ? 'this as a safe option.' : 'Wise for a safer option, though the rate is slightly lower.'}
          </span>
        </div>

        <div className="modal-actions">
          <button className="btn-outline-modal">
            View on Binance <ExternalLink size={14} />
          </button>
          <button className="btn-primary-modal" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}