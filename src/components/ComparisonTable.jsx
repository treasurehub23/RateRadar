import MerchantBadge from './MerchantBadge'
import './ComparisonTable.css'

const LOGO_MAP = {
  'Binance P2P': { domain: 'binance.com', bg: '#F0B90B', label: 'B' },
  'Wise':       { domain: 'wise.com',     bg: '#9FE870', label: 'W' },
  'Lemfi':      { domain: 'lemfi.com',    bg: '#00C48C', label: 'L' },
  'Sendwave':   { domain: 'sendwave.com', bg: '#FFD23F', label: 'S' },
  'GTBank':     { domain: 'gtbank.com',   bg: '#E31E24', label: 'G' },
}

function ProviderLogo({ provider }) {
  const meta = LOGO_MAP[provider] || { domain: null, bg: '#7C3AED', label: provider[0] }

  if (!meta.domain) {
    return (
      <div className="provider-logo" style={{ background: meta.bg }}>
        {meta.label}
      </div>
    )
  }

  return (
    <div className="provider-logo" style={{ background: meta.bg }}>
      <img
        src={`https://logo.clearbit.com/${meta.domain}`}
        alt={provider}
        onError={(e) => {
          e.currentTarget.style.display = 'none'
          e.currentTarget.parentElement.textContent = meta.label
        }}
      />
    </div>
  )
}

export default function ComparisonTable({ routes, loading, rateUnit = '1 GBP', toCode = 'NGN', onView }) {
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
        <div>Exchange Rate ({rateUnit})</div>
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

          <div className="cell-receive">{r.received.toLocaleString()} {toCode}</div>
          <div className="cell-rate">₦{r.rate.toLocaleString()} / £1</div>
          <div className="cell-fees">{r.feePercent}% + ₦{r.feeFlat}</div>
          <div className="cell-cost">₦{r.totalCost.toLocaleString()}</div>
          <div className="cell-reliability"><MerchantBadge reliability={r.reliability} /></div>
          <div className="cell-action">
            <button className="btn-view" onClick={() => onView && onView(r)}>View</button>
          </div>
        </div>
      ))}
    </div>
  )
}