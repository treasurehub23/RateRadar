import MerchantBadge from './MerchantBadge'
import './ComparisonTable.css'

export default function ComparisonTable({ routes, loading }) {
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
        <div>Exchange Rate (1 GBP)</div>
        <div>Fees</div>
        <div>Total Cost</div>
        <div>Reliability</div>
        <div></div>
      </div>

      {routes.map((r, i) => (
        <div key={r.provider} className={`table-row ${r.bestRate ? 'best' : ''}`}>
          <div className="cell-provider">
            <div className="provider-logo" style={{ background: getLogoBg(r.provider) }}>
              {getLogoText(r.provider)}
            </div>
            <div>
              <div className="provider-name">
                {r.provider}
                {r.bestRate && <span className="best-badge">Best Rate</span>}
              </div>
              <div className="provider-method">{r.method}</div>
            </div>
          </div>
          <div className="cell-receive">₦{r.received.toLocaleString()}</div>
          <div className="cell-rate">₦{r.rate.toLocaleString()} / £1</div>
          <div className="cell-fees">{r.feePercent}% + ₦{r.feeFlat}</div>
          <div className="cell-cost">₦{r.totalCost.toLocaleString()}</div>
          <div className="cell-reliability"><MerchantBadge reliability={r.reliability} /></div>
          <div className="cell-action">
            <button className="btn-view">View</button>
          </div>
        </div>
      ))}
    </div>
  )
}

function getLogoBg(p) {
  const m = { 'Binance P2P': '#F0B90B', 'Wise': '#9FE870', 'Lemfi': '#00C48C', 'Sendwave': '#FFD23F', 'GTBank': '#E31E24' }
  return m[p] || '#7C3AED'
}
function getLogoText(p) {
  const m = { 'Binance P2P': '⬢', 'Wise': '7', 'Lemfi': 'L', 'Sendwave': '❯', 'GTBank': 'G' }
  return m[p] || p[0]
}