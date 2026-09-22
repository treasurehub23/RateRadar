import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import ComparisonTable from '../components/ComparisonTable'
import CorridorSelector from '../components/CorridorSelector'
import MerchantModal from '../components/MerchantModal'
import { getComparison, MOCK_TREND } from '../api'
import { CORRIDORS, getCorridor } from '../constants'
import './Dashboard.css'

const FLAG_ISO = { GBP: 'gb', USD: 'us', CAD: 'ca', EUR: 'eu', KES: 'ke', NGN: 'ng', GHS: 'gh' }

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
}, [corridor, amount])

  const jumpToCorridor = (value) => {
    setCorridor(value)
    setLoading(true)
    getComparison(value, amount).then((res) => {
      setData(res)
      setLoading(false)
    })
  }

  const best = data?.routes?.[0]
  const worst = data?.routes?.[data.routes.length - 1]
  const savings = best && worst ? best.received - worst.received : 0

  return (
    <div>
      {/* HERO */}
      <div className="hero">
        <div className="hero-text">
          <h1>
            Find the <span className="accent">best</span> way
            <br />
            to send money across borders
          </h1>
          <p>
            Compare exchange rates, fees and total amount across multiple providers.
            Get the best deal, with confidence.
          </p>
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

          {/* Dashed arcs */}
          <svg className="hero-arcs" viewBox="0 0 400 400" fill="none">
            <path d="M 100 130 Q 60 60 140 40" stroke="#A78BFA" strokeWidth="1.5" strokeDasharray="4 5" />
            <path d="M 300 130 Q 340 60 260 40" stroke="#A78BFA" strokeWidth="1.5" strokeDasharray="4 5" />
            <path d="M 100 270 Q 60 340 140 360" stroke="#A78BFA" strokeWidth="1.5" strokeDasharray="4 5" />
            <path d="M 300 270 Q 340 340 260 360" stroke="#A78BFA" strokeWidth="1.5" strokeDasharray="4 5" />
            <path d="M 140 40 L 133 44 L 135 36 Z" fill="#A78BFA" />
            <path d="M 260 40 L 265 46 L 267 38 Z" fill="#A78BFA" />
          </svg>

          {/* From flag */}
          <div className="flag-chip flag-chip-from">
            <img src={`https://flagcdn.com/w40/${fromISO}.png`} alt="" className="flag-img" />
            <span className="flag-code">{selected.fromCode.slice(0, 2).toUpperCase()}</span>
          </div>

          {/* To flag */}
          <div className="flag-chip flag-chip-to">
            <img src={`https://flagcdn.com/w40/${toISO}.png`} alt="" className="flag-img" />
            <span className="flag-code">{selected.toCode.slice(0, 2).toUpperCase()}</span>
          </div>

          {/* Rate preview */}
          <div className="rate-preview">
            <div className="rp-row">
              <span className="rp-label">Send</span>
              <span className="rp-value">{selected.currency}{amount.toLocaleString()}</span>
            </div>
            <div className="rp-row">
              <span className="rp-label">Get</span>
              <span className="rp-value big">
  {best ? Math.round(best.received * (amount / 1000)).toLocaleString() : '—'} {selected.toCode}
</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="dashboard-grid">
        <div className="dashboard-main">
          <h2 className="section-title">Comparison Results</h2>
          <p className="section-sub">
            Showing the best rates for {selected.currency}{amount.toLocaleString()} from{' '}
            {selected.fromLabel.split(' (')[0]} to {selected.toLabel.split(' (')[0]}
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
                <strong>
                  You could get {savings.toLocaleString()} {selected.toCode} more with {best.provider}!
                </strong>
                <p>
                  Compared to the worst option, you'll receive {best.received.toLocaleString()}{' '}
                  instead of {worst.received.toLocaleString()} {selected.toCode}.
                </p>
              </div>
              <button className="btn-outline">See Details</button>
            </div>
          )}

          <h3 className="section-title" style={{ marginTop: 40 }}>Popular Corridors</h3>
          <div className="popular-grid">
            {CORRIDORS.map((c) => {
              const iso = FLAG_ISO[c.fromCode] || 'gb'
              return (
                <button
                  key={c.value}
                  className="popular-card"
                  onClick={() => jumpToCorridor(c.value)}
                >
                  <img
                    src={`https://flagcdn.com/w40/${iso}.png`}
                    alt=""
                    className="popular-flag-img"
                  />
                  <div>
                    <div className="popular-label">
                      {c.fromLabel.split(' (')[0]} → {c.toLabel.split(' (')[0]}
                    </div>
                    <div className="popular-code">{c.fromCode} → {c.toCode}</div>
                  </div>
                  <div className="popular-amount">{c.popularAmount}</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className="dashboard-side">
          {/* Transfer Summary */}
          <div className="side-card">
            <h3>Transfer Summary</h3>
            <div className="summary-row">
              <span>From</span>
              <strong>
                <img src={`https://flagcdn.com/w20/${fromISO}.png`} alt="" className="inline-flag" />
                {selected.fromLabel}
              </strong>
            </div>
            <div className="summary-row">
              <span>To</span>
              <strong>
                <img src={`https://flagcdn.com/w20/${toISO}.png`} alt="" className="inline-flag" />
                {selected.toLabel}
              </strong>
            </div>
            <div className="summary-row">
              <span>Amount</span>
              <strong>{selected.currency}{amount.toLocaleString()}</strong>
            </div>
            {best && (
              <div className="best-option-box">
                <div className="bo-label">Best Option</div>
                <div className="bo-provider">{best.provider}</div>
                <div className="bo-amount">
                  You'll receive {best.received.toLocaleString()} {selected.toCode}
                </div>
              </div>
            )}
          </div>

          {/* Rate Trend */}
          <div className="side-card">
            <div className="side-card-head">
              <h3>Rate Trend</h3>
              <span className="muted">Last 7 days</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={MOCK_TREND} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="rateGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F0F5" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: '#9CA3AF' }}
                  stroke="#E5E7EB"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#9CA3AF' }}
                  stroke="#E5E7EB"
                  tickLine={false}
                  axisLine={false}
                  domain={['dataMin - 50', 'dataMax + 50']}
                />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #EDE9FE', fontSize: 12 }} />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke="#7C3AED"
                  strokeWidth={2.5}
                  fill="url(#rateGrad)"
                  dot={{ r: 4, fill: '#7C3AED', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Safety */}
          <div className="side-card safety">
            <div className="safety-icon">🛡️</div>
            <h3>Stay safe. Always.</h3>
            <p>We show you reliability scores based on merchant history, reviews and completion rates.</p>
            <a href="#">Learn more</a>
          </div>
        </aside>
      </div>

      {openMerchant && (
        <MerchantModal route={openMerchant} onClose={() => setOpenMerchant(null)} />
      )}
    </div>
  )
}