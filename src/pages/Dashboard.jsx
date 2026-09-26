import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import ComparisonTable from '../components/ComparisonTable'
import CorridorSelector from '../components/CorridorSelector'
import MerchantModal from '../components/MerchantModal'
import PhoneShowcase from '../components/PhoneShowcase'
import { getComparison, MOCK_TREND } from '../api'
import { COUNTRIES, getCountryByCurrency, CORRIDORS } from '../constants'
import './Dashboard.css'

export default function Dashboard() {
  const [fromCode, setFromCode] = useState('GBP')
  const [toCode, setToCode] = useState('NGN')
  const [amount, setAmount] = useState(0)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [openMerchant, setOpenMerchant] = useState(null)

  const corridor = `${fromCode}-${toCode}`
  const fromCountry = getCountryByCurrency(fromCode)
  const toCountry = getCountryByCurrency(toCode)

  const fromSymbol = fromCountry.symbol
  const toSymbol = data?.symbol || toCountry.symbol

  const handleCompare = async () => {
    setLoading(true)
    const res = await getComparison(corridor, amount)
    setData(res)
    setLoading(false)
  }

  useEffect(() => {
    handleCompare()
    // eslint-disable-next-line
  }, [fromCode, toCode, amount])

  const best = data?.routes?.[0]
  const worst = data?.routes?.[data.routes.length - 1]
  const savings = best && worst ? best.received - worst.received : 0
  const routes = data?.routes || []

  const jumpToCorridor = (value) => {
    const [f, t] = value.split('-')
    setFromCode(f)
    setToCode(t)
  }

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
            fromCode={fromCode}
            setFromCode={setFromCode}
            toCode={toCode}
            setToCode={setToCode}
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

          <svg className="hero-arcs" viewBox="0 0 400 400" fill="none">
            <path d="M 100 130 Q 60 60 140 40" stroke="#A78BFA" strokeWidth="1.5" strokeDasharray="4 5" />
            <path d="M 300 130 Q 340 60 260 40" stroke="#A78BFA" strokeWidth="1.5" strokeDasharray="4 5" />
            <path d="M 100 270 Q 60 340 140 360" stroke="#A78BFA" strokeWidth="1.5" strokeDasharray="4 5" />
            <path d="M 300 270 Q 340 340 260 360" stroke="#A78BFA" strokeWidth="1.5" strokeDasharray="4 5" />
          </svg>

          <div className="flag-chip flag-chip-from">
            <img src={`https://flagcdn.com/w40/${fromCountry.iso}.png`} alt="" className="flag-img" />
            <span className="flag-code">{fromCode}</span>
          </div>

          <div className="flag-chip flag-chip-to">
            <img src={`https://flagcdn.com/w40/${toCountry.iso}.png`} alt="" className="flag-img" />
            <span className="flag-code">{toCode}</span>
          </div>

          <div className="hero-stack">
            <div className="stack-card stack-back">
              <div className="stack-head">
                <span className="stack-dot" />
                <span>All providers</span>
              </div>
              {routes.slice(0, 4).map((r) => (
                <div key={r.provider} className="stack-row">
                  <span>{r.provider}</span>
                  <strong>{toSymbol}{r.received.toLocaleString()}</strong>
                </div>
              ))}
              {routes.length === 0 && (
                <>
                  <div className="stack-row"><span>Bybit P2P</span><strong>—</strong></div>
                  <div className="stack-row"><span>Wise</span><strong>—</strong></div>
                </>
              )}
            </div>

            <div className="stack-card stack-front">
              <div className="stack-head">
                <span className="stack-dot stack-dot-live" />
                <span>Live rate</span>
              </div>
              <div className="stack-big">
                {best ? `${toSymbol}${best.rate.toLocaleString()}` : `${toSymbol}—`}
                <small>/{fromCode}</small>
              </div>
              <div className="stack-sub">
                {best ? `Best on ${best.provider}` : 'Waiting for rates...'}
              </div>
              {savings > 0 && (
                <div className="stack-badge">
                  Save {toSymbol}{savings.toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="dashboard-grid">
        <div className="dashboard-main">
          <h2 className="section-title">Comparison Results</h2>
          <p className="section-sub">
            Showing the best rates for {fromSymbol}{amount.toLocaleString()} from {fromCountry.name} to {toCountry.name}
          </p>

          <ComparisonTable
            routes={routes}
            loading={loading}
            fromSymbol={fromSymbol}
            toSymbol={toSymbol}
            toCode={toCode}
            onView={(route) => setOpenMerchant(route)}
          />

          {savings > 0 && (
            <div className="savings-banner">
              <span className="savings-icon">💡</span>
              <div>
                <strong>
                  You could get {toSymbol}{savings.toLocaleString()} more with {best.provider}!
                </strong>
                <p>
                  Compared to the worst option, you'll receive {toSymbol}{best.received.toLocaleString()}{' '}
                  instead of {toSymbol}{worst.received.toLocaleString()}.
                </p>
              </div>
              <button className="btn-outline">See Details</button>
            </div>
          )}
        </div>

        <aside className="dashboard-side">
          <div className="side-card">
            <h3>Transfer Summary</h3>
            <div className="summary-row">
              <span>From</span>
              <strong>
                <img src={`https://flagcdn.com/w20/${fromCountry.iso}.png`} alt="" className="inline-flag" />
                {fromCountry.name}
              </strong>
            </div>
            <div className="summary-row">
              <span>To</span>
              <strong>
                <img src={`https://flagcdn.com/w20/${toCountry.iso}.png`} alt="" className="inline-flag" />
                {toCountry.name}
              </strong>
            </div>
            <div className="summary-row">
              <span>Amount</span>
              <strong>{fromSymbol}{amount.toLocaleString()}</strong>
            </div>
            {best && (
              <div className="best-option-box">
                <div className="bo-label">Best Option</div>
                <div className="bo-provider">{best.provider}</div>
                <div className="bo-amount">
                  You'll receive {toSymbol}{best.received.toLocaleString()}
                </div>
              </div>
            )}
          </div>

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
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF' }} stroke="#E5E7EB" tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} stroke="#E5E7EB" tickLine={false} axisLine={false} domain={['dataMin - 50', 'dataMax + 50']} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #EDE9FE', fontSize: 12 }} />
                <Area type="monotone" dataKey="rate" stroke="#7C3AED" strokeWidth={2.5} fill="url(#rateGrad)" dot={{ r: 4, fill: '#7C3AED', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </AreaChart>
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

      <PhoneShowcase />

      <div className="popular-section">
        <h3 className="section-title">Popular Corridors</h3>
        <div className="popular-grid">
          {CORRIDORS.map((c) => {
            const fromC = getCountryByCurrency(c.fromCode)
            return (
              <button key={c.value} className="popular-card" onClick={() => jumpToCorridor(c.value)}>
                <img src={`https://flagcdn.com/w40/${fromC.iso}.png`} alt="" className="popular-flag-img" />
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

      {openMerchant && (
        <MerchantModal
          route={openMerchant}
          onClose={() => setOpenMerchant(null)}
          toSymbol={toSymbol}
        />
      )}
    </div>
  )
}