import MerchantBadge from './MerchantBadge'
import './ComparisonTable.css'

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
    <svg viewBox="0 0 40 40" width="22" height="22">
      <text x="20" y="28" textAnchor="middle" fill="#fff" fontSize="24" fontWeight="800" fontFamily="Sora, sans-serif">L</text>
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
    <svg viewBox="0 0 40 40" width="22" height="22">
      <text x="20" y="28" textAnchor="middle" fill="#fff" fontSize="24" fontWeight="800" fontFamily="Sora, sans-serif">G</text>
    </svg>
  )
}

const LOGO_MAP = {
  'Bybit P2P': { Logo: BybitLogo,    bg: '#0B0E11' },
  'Wise':      { Logo: WiseLogo,     bg: '#9FE870' },
  'Lemfi':     { Logo: LemfiLogo,    bg: '#00C48C' },
  'Sendwave':  { Logo: SendwaveLogo, bg: '#FFD23F' },
  'GTBank':    { Logo: GtbankLogo,   bg: '#E31E24' },
}

function ProviderLogo({ provider }) {
  const meta = LOGO_MAP[provider]
  if (!meta) {
    return (
      <div className="provider-logo" style={{ background: '#7C3AED' }}>
        <span className="provider-logo-fallback">{provider[0]}</span>
      </div>
    )
  }
  const { Logo, bg } = meta
  return (
    <div className="provider-logo" style={{ background: bg }}>
      <Logo />
    </div>
  )
}

export default function ComparisonTable({
  routes,
  loading,
  fromSymbol = '£',
  toSymbol = '₦',
  toCode = 'NGN',
  onView,
}) {
  if (loading) {
    return (
      <div className="table-skeleton">
        {[1, 2, 3, 4, 5].map((i) => <div key={i} className="skel-row" />)}
      </div>
    )
  }

  if (!routes || routes.length === 0) {
    return (
      <div className="table-empty">
        Select a corridor and click <strong>Compare</strong> to see live rates.
      </div>
    )
  }

  return (
    <div className="comparison-table">
      <div className="table-header">
        <div>Provider</div>
        <div>You'll Receive</div>
        <div>Exchange Rate</div>
        <div>Fees</div>
        <div>Total Cost</div>
        <div>Reliability</div>
        <div></div>
      </div>

      {routes.map((r) => (
        <div key={r.provider} className={`table-row ${r.bestRate ? 'best' : ''}`}>
          <div className="cell-provider">
            <ProviderLogo provider={r.provider} />
            <div>
              <div className="provider-name">
                {r.provider}
                {r.bestRate && <span className="best-badge">Best Rate</span>}
              </div>
              <div className="provider-method">{r.method}</div>
            </div>
          </div>

          <div className="cell-receive">
            {toSymbol}{r.received.toLocaleString()}
          </div>

          <div className="cell-rate">
            {toSymbol}{r.rate.toLocaleString()} / {fromSymbol}1
          </div>

          <div className="cell-fees">
            {r.feePercent}% + {toSymbol}{r.feeFlat.toLocaleString()}
          </div>

          <div className="cell-cost">
            {toSymbol}{r.totalCost.toLocaleString()}
          </div>

          <div className="cell-reliability">
            <MerchantBadge reliability={r.reliability} />
          </div>

          <div className="cell-action">
            <button className="btn-view" onClick={() => onView && onView(r)}>View</button>
          </div>
        </div>
      ))}
    </div>
  )
}