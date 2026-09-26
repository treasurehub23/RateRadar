import { X, Info, ExternalLink, Clock, CheckCircle, Users, Star } from 'lucide-react'
import './MerchantModal.css'

function BybitLogo() {
  return (
    <svg viewBox="0 0 40 40" width="22" height="22">
      <path d="M6 8 h14 a7 7 0 0 1 0 14 h-14 z" fill="#F7A600" opacity="0.65" />
      <path d="M6 18 h12 a6 6 0 0 1 0 12 h-12 z" fill="#F7A600" />
      <rect x="6" y="8" width="4" height="22" fill="#F7A600" />
    </svg>
  )
}

function WiseLogo() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="#163300">
      <path d="M11.045 0 6.32 9.02h5.372L8.75 24l13.858-14.61h-5.628L22.78 0z"/>
    </svg>
  )
}

function LemfiLogo() {
  return (
    <svg viewBox="0 0 40 40" width="24" height="24">
      <text x="20" y="30" textAnchor="middle" fill="#fff" fontSize="26" fontWeight="800" fontFamily="Sora, sans-serif">L</text>
    </svg>
  )
}

function SendwaveLogo() {
  return (
    <svg viewBox="0 0 40 40" width="22" height="22" fill="#0B1F3A">
      <path d="M6 22c4 0 6-4 10-4s6 4 10 4 6-4 8-4v3c-2 0-4 4-8 4s-6-4-10-4-6 4-10 4-4-2-4-3z"/>
      <path d="M6 16c4 0 6-4 10-4s6 4 10 4 6-4 8-4v3c-2 0-4 4-8 4s-6-4-10-4-6 4-10 4-4-2-4-3z" opacity="0.7"/>
    </svg>
  )
}

function GtbankLogo() {
  return (
    <svg viewBox="0 0 40 40" width="24" height="24">
      <text x="20" y="30" textAnchor="middle" fill="#fff" fontSize="26" fontWeight="800" fontFamily="Sora, sans-serif">G</text>
    </svg>
  )
}

const PROVIDER_META = {
  'Bybit P2P': { Logo: BybitLogo,    bg: '#0B0E11', kind: 'p2p' },
  'Wise':      { Logo: WiseLogo,     bg: '#9FE870', kind: 'transfer' },
  'Lemfi':     { Logo: LemfiLogo,    bg: '#00C48C', kind: 'transfer' },
  'Sendwave':  { Logo: SendwaveLogo, bg: '#FFD23F', kind: 'transfer' },
  'GTBank':    { Logo: GtbankLogo,   bg: '#E31E24', kind: 'bank' },
}

// Seeded pseudo-random so values stay stable per provider
function seeded(seed) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 1000
  return (n) => {
    h = (h * 9301 + 49297) % 233280
    return (h / 233280) * n
  }
}

function getMerchantStats(provider, reliability) {
  const rand = seeded(provider + reliability)

  if (reliability === 'high') {
    return {
      completion: 96 + Math.floor(rand(3)),
      releaseTime: 2 + Math.floor(rand(3)),
      trades: 2000 + Math.floor(rand(6000)),
      rating: (4.7 + rand(0.25)).toFixed(1),
      reviews: 400 + Math.floor(rand(800)),
    }
  }
  if (reliability === 'medium') {
    return {
      completion: 68 + Math.floor(rand(15)),
      releaseTime: 6 + Math.floor(rand(6)),
      trades: 800 + Math.floor(rand(1500)),
      rating: (4.0 + rand(0.4)).toFixed(1),
      reviews: 150 + Math.floor(rand(300)),
    }
  }
  return {
    completion: 38 + Math.floor(rand(20)),
    releaseTime: 14 + Math.floor(rand(10)),
    trades: 50 + Math.floor(rand(300)),
    rating: (2.8 + rand(0.7)).toFixed(1),
    reviews: 20 + Math.floor(rand(80)),
  }
}

export default function MerchantModal({ route, onClose, toSymbol = '₦' }) {
  if (!route) return null

  const reliability = (route.reliability || 'medium').toLowerCase()
  const meta = PROVIDER_META[route.provider] || { Logo: BybitLogo, bg: '#7C3AED', kind: 'transfer' }
  const { Logo, bg, kind } = meta

const stats = getMerchantStats(route.provider + route.received, reliability)

  const colorMap = {
    high:   { bg: '#D1FAE5', color: '#047857', pct: stats.completion },
    medium: { bg: '#FEF3C7', color: '#B45309', pct: stats.completion },
    low:    { bg: '#FEE2E2', color: '#B91C1C', pct: stats.completion },
  }
  const rc = colorMap[reliability] || colorMap.medium

  const isP2P = kind === 'p2p'
  const detailsLabel = isP2P ? 'Merchant Details' : 'Provider Details'

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="modal-provider-head">
          <div className="modal-provider-logo" style={{ background: bg }}>
            <Logo />
          </div>
          <div>
            <div className="modal-provider-name">{route.provider}</div>
            <div className="modal-provider-method">{route.method}</div>
          </div>
        </div>

        <div className="modal-body">
          <div>
            <div className="modal-receive-label">You'll Receive</div>
            <div className="modal-receive-amount">
  {toSymbol}{route.received.toLocaleString()}
</div>
          </div>
          <div className="modal-side">
            {route.bestRate && <span className="best-badge">Best Rate</span>}
            <div className="reliability-box" style={{ background: rc.bg }}>
              <div className="reliability-box-label">Reliability Score</div>
              <div className="reliability-box-value" style={{ color: rc.color }}>
                {reliability.toUpperCase()}
              </div>
              <div className="reliability-box-pct" style={{ color: rc.color }}>
                ({rc.pct}%)
              </div>
            </div>
          </div>
        </div>

        <div className="modal-details-title">{detailsLabel}</div>

        <div className="modal-details">
          <div className="detail-row">
            <span className="detail-row-label"><CheckCircle size={15} /> Completion Rate</span>
            <span className="detail-row-value">{stats.completion}%</span>
          </div>
          <div className="detail-row">
            <span className="detail-row-label"><Clock size={15} /> Average Release Time</span>
            <span className="detail-row-value">{stats.releaseTime} min</span>
          </div>
          <div className="detail-row">
            <span className="detail-row-label"><Users size={15} /> Total Trades</span>
            <span className="detail-row-value">{stats.trades.toLocaleString()}</span>
          </div>
          <div className="detail-row">
            <span className="detail-row-label"><Star size={15} /> Reviews</span>
            <span className="detail-row-value">{stats.rating} ★ ({stats.reviews})</span>
          </div>
        </div>

        <div className="modal-note">
          <Info size={16} className="modal-note-icon" />
          <span>
            {isP2P
              ? `This merchant has a ${reliability} reliability score. ${reliability === 'high' ? 'Safe to trade.' : 'Consider Wise for a safer option, though the rate is slightly lower.'}`
              : `This provider has a ${reliability} reliability score. ${reliability === 'high' ? 'Safe and recommended.' : 'Check recent user reports before sending.'}`}
          </span>
        </div>

        <div className="modal-actions">
          <button className="btn-outline-modal">
            View on {route.provider.split(' ')[0]} <ExternalLink size={14} />
          </button>
          <button className="btn-primary-modal" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}