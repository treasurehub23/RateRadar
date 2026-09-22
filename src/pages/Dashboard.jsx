import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import ComparisonTable from '../components/ComparisonTable'
import CorridorSelector from '../components/CorridorSelector'
import { getComparison, MOCK_TREND } from '../api'
import './Dashboard.css'

function GlobeTexture() {
  return (
    <svg viewBox="0 0 400 400" className="globe-svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="ocean" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="55%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#5B21B6" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="200" fill="url(#ocean)" />

      <g fill="#DDD6FE" opacity="0.75">
        {/* North America */}
        <ellipse cx="85" cy="140" rx="42" ry="55" />
        <ellipse cx="115" cy="180" rx="22" ry="18" />
        {/* South America */}
        <ellipse cx="135" cy="275" rx="26" ry="50" />
        {/* Europe */}
        <ellipse cx="225" cy="118" rx="36" ry="24" />
        {/* Africa */}
        <ellipse cx="225" cy="235" rx="40" ry="62" />
        {/* Asia */}
        <ellipse cx="320" cy="155" rx="72" ry="55" />
        {/* Australia */}
        <ellipse cx="345" cy="290" rx="30" ry="20" />
      </g>

      <g stroke="#EDE9FE" strokeWidth="0.5" fill="none" opacity="0.28">
        <ellipse cx="200" cy="200" rx="60" ry="200" />
        <ellipse cx="200" cy="200" rx="120" ry="200" />
        <ellipse cx="200" cy="200" rx="180" ry="200" />
        <line x1="0" y1="200" x2="400" y2="200" />
        <line x1="0" y1="140" x2="400" y2="140" />
        <line x1="0" y1="260" x2="400" y2="260" />
      </g>
    </svg>
  )
}

export default function Dashboard() {
  const [corridor, setCorridor] = useState('UK-NG')
  const [amount, setAmount] = useState(1000)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCompare = async () => {
    setLoading(true)
    const res = await getComparison(corridor, amount)
    setData(res)
    setLoading(false)
  }

  const best = data?.routes?.[0]
  const worst = data?.routes?.[data.routes.length - 1]
  const savings = best && worst ? best.received - worst.received : 0

  return (
    <div>
      <div className="hero">
        <div className="hero-text">
          <h1>Find the best way<br />to send money across borders</h1>
          <p>Compare exchange rates, fees and total amount across multiple providers. Get the best deal, with confidence.</p>
          <CorridorSelector corridor={corridor} setCorridor={setCorridor} amount={amount} setAmount={setAmount} onCompare={handleCompare} loading={loading} />
        </div>

        <div className="hero-visual">
          <div className="globe">
            <div className="globe-track">
              <GlobeTexture />
              <GlobeTexture />
            </div>
            <div className="globe-shine" />
          </div>

          <div className="hero-badge hero-badge-left">£</div>
          <div className="hero-badge hero-badge-right">₦</div>

          <svg className="hero-arrow" viewBox="0 0 100 60">
            <path d="M 20 50 Q 40 10 85 15" stroke="#7C3AED" strokeWidth="2" fill="none" strokeDasharray="4 4" />
            <path d="M 85 15 L 76 10 L 80 22 Z" fill="#7C3AED" />
          </svg>

          <div className="hero-note">
            <span>Better rates.</span>
            <span>More value.</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-main">
          <h2 className="section-title">Comparison Results</h2>
          <p className="section-sub">Showing the best rates for £{amount.toLocaleString()} from United Kingdom to Nigeria</p>

          <ComparisonTable routes={data?.routes || []} loading={loading} />

          {savings > 0 && (
            <div className="savings-banner">
              <span className="savings-icon">💡</span>
              <div>
                <strong>You could get ₦{savings.toLocaleString()} more with {best.provider}!</strong>
                <p>Compared to the bank, you will receive ₦{best.received.toLocaleString()} instead of ₦{worst.received.toLocaleString()}.</p>
              </div>
              <button className="btn-outline">See Details</button>
            </div>
          )}

          <h3 className="section-title" style={{ marginTop: 40 }}>Popular Corridors</h3>
          <div className="popular-grid">
            {[
              { flag: '🇺🇸', from: 'USA', to: 'Nigeria', code: 'USD → NGN', amount: '₦1,580,000' },
              { flag: '🇨🇦', from: 'Canada', to: 'Nigeria', code: 'CAD → NGN', amount: '₦1,620,000' },
              { flag: '🇬🇧', from: 'UK', to: 'Nigeria', code: 'GBP → NGN', amount: '₦1,680,000' },
              { flag: '🇪🇺', from: 'EU', to: 'Nigeria', code: 'EUR → NGN', amount: '₦1,645,000' },
            ].map((c) => (
              <div key={c.from} className="popular-card">
                <div className="popular-flag">{c.flag}</div>
                <div>
                  <div className="popular-label">{c.from} → {c.to}</div>
                  <div className="popular-code">{c.code}</div>
                </div>
                <div className="popular-amount">{c.amount}</div>
              </div>
            ))}
          </div>
        </div>

        <aside className="dashboard-side">
          <div className="side-card">
            <h3>Transfer Summary</h3>
            <div className="summary-row"><span>From</span><strong>🇬🇧 United Kingdom (GBP)</strong></div>
            <div className="summary-row"><span>To</span><strong>🇳🇬 Nigeria (NGN)</strong></div>
            <div className="summary-row"><span>Amount</span><strong>£{amount.toLocaleString()}</strong></div>
            {best && (
              <div className="best-option-box">
                <div className="bo-label">Best Option</div>
                <div className="bo-provider">{best.provider}</div>
                <div className="bo-amount">You will receive ₦{best.received.toLocaleString()}</div>
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
    </div>
  )
}