import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import ComparisonTable from '../components/ComparisonTable'
import CorridorSelector from '../components/CorridorSelector'
import MerchantModal from '../components/MerchantModal'
import { getComparison, MOCK_TREND } from '../api'
import { CORRIDORS, getCorridor } from '../constants'
import './Dashboard.css'

const FLAG_ISO = { GBP: 'gb', USD: 'us', CAD: 'ca', EUR: 'eu', KES: 'ke', NGN: 'ng' }

export default function Dashboard() {
  const [corridor, setCorridor] = useState('UK-NG')
  const [amount, setAmount] = useState(1000)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [openMerchant, setOpenMerchant] = useState(null)

  const selected = getCorridor(corridor)
  const fromISO = FLAG_ISO[selected.fromCode] || 'gb'
  const toISO = FLAG_ISO[selected.toCode] || 'ng'

  const handleCompare = async () => {
    setLoading(true)
    const res = await getComparison(corridor, amount)
    setData(res)
    setLoading(false)
  }

  useEffect(() => {
    handleCompare()
    // eslint-disable-next-line
  }, [])

  const jumpToCorridor = (value) => {
    setCorridor(value)
    setLoading(true)
    getComparison(value, amount).then((res) => { setData(res); setLoading(false) })
  }

  const best = data?.routes?.[0]
  const worst = data?.routes?.[data.routes.length - 1]
  const savings = best && worst ? best.received - worst.received : 0

  return (
    <div>
      <div className="hero">
        <div className="hero-text">
          <h1>Find the <span className="accent">best</span> way<br />to send money across borders</h1>
          <p>Compare exchange rates, fees and total amount across multiple providers. Get the best deal, with confidence.</p>
          <CorridorSelector
            corridor={corridor}
            setCorridor={setCorridor}
            amount={amount}
            setAmount={setAmount}
            onCompare={handleCompare}
            loading={loading}
          />
        </div>

        <div className="hero-visual">
          <div className="earth-sphere">
            <div className="earth-track" />
            <div className="earth-shade" />
          </div>

          <div className="flag-chip">
            <img src={`https://flagcdn.com/w40/${fromISO}.png`} alt="" className="flag-img" />
            <span className="flag-code">{selected.fromCode}</span>
          </div>

          <div className="rate-preview">
            <div className="rp-row">
              <span className="rp-label">Send</span>
              <span className="rp-value">{selected.currency}{amount.toLocaleString()}</span>
            </div>
            <div className="rp-row">
              <span className="rp-label">Get</span>
              <span className="rp-value big">{best ? best.received.toLocaleString() : '—'} {selected.toCode}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-main">
          <h2 className="section-title">Comparison Results</h2>
          <p className="section-sub">
            Showing the best rates for {selected.currency}{amount.toLocaleString()} from {selected.fromLabel.split(' (')[0]} to {selected.toLabel.split(' (')[0]}
          </p>

          <ComparisonTable
            routes={data?.routes || []}
            loading={loading}
            rateUnit={`1 ${selected.fromCode}`}
            toCode={selected.toCode}
            onView={(route) => setOpenMerchant(route)}
          />

          {savings > 0 && (
            <div className="savings-banner">
              <span className="savings-icon">💡</span>
              <div>
                <strong>You could get {savings.toLocaleString()} {selected.toCode} more with {best.provider}!</strong>
                <p>Compared to the worst option, you'll receive {best.received.toLocaleString()} instead of {worst.received.toLocaleString()} {selected.toCode}.</p>
              </div>
              <button className="btn-outline">See Details</button>
            </div>
          )}

          <h3 className="section-title" style={{ marginTop: 40 }}>Popular Corridors</h3>
          <div className="popular-grid">
            {CORRIDORS.map((c) => {
              const iso = FLAG_ISO[c.fromCode] || 'gb'
              return (
                <button key={c.value} className="popular-card" onClick={() => jumpToCorridor(c.value)}>
                  <img src={`https://flagcdn.com/w40/${iso}.png`} alt="" className="popular-flag-img" />
                  <div>
                    <div className="popular-label">{c.fromLabel.split(' (')[0]} → {c.toLabel.split(' (')[0]}</div>
                    <div className="popular-code">{c.fromCode} → {c.toCode}</div>
                  </div>
                  <div className="popular-amount">{c.popularAmount}</div>
                </button>
              )
            })}
          </div>
        </div>

        <aside className="dashboard-side">
          <div className="side-card">
            <h3>Transfer Summary</h3>
            <div className="summary-row">
              <span>From</span>
              <strong><img src={`https://flagcdn.com/w20/${fromISO}.png`} alt="" className="inline-flag" /> {selected.fromLabel}</strong>
            </div>
            <div className="summary-row">
              <span>To</span>
              <strong><img src={`https://flagcdn.com/w20/${toISO}.png`} alt="" className="inline-flag" /> {selected.toLabel}</strong>
            </div>
            <div className="summary-row"><span>Amount</span><strong>{selected.currency}{amount.toLocaleString()}</strong></div>
            {best && (
              <div className="best-option-box">
                <div className="bo-label">Best Option</div>
                <div className="bo-provider">{best.provider}</div>
                <div className="bo-amount">You'll receive {best.received.toLocaleString()} {selected.toCode}</div>
              </div>
            )}
          </div>

          <div className="side-card">
            <h3>Rate Trend <span className="muted">(Last 7 days)</span></h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={MOCK_TREND}>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#9CA3AF" />
                <YAxis tick={{ fontSize: 11 }} stroke="#9CA3AF" domain={['dataMin - 50', 'dataMax + 50']} />
                <Tooltip />
                <Line type="monotone" dataKey="rate" stroke="#7C3AED" strokeWidth={2.5} dot={{ r: 3.5, fill: '#7C3AED' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="side-card safety">
            <div className="safety-icon">🛡️</div>
            <h3>Stay safe. Always.</h3>
            <p>We show you reliability scores based on merchant history, reviews and completion rates.</p>
            <a href="#">Learn more</a>
          </div>
        </aside>
      </div>

      {openMerchant && <MerchantModal route={openMerchant} onClose={() => setOpenMerchant(null)} />}
    </div>
  )
}