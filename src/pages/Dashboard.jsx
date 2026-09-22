import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import ComparisonTable from '../components/ComparisonTable'
import CorridorSelector from '../components/CorridorSelector'
import { getComparison, getTrend, MOCK_TREND } from '../api'
import './Dashboard.css'

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
      {/* Hero */}
      <div className="hero">
        <h1>Send money smarter.</h1>
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

      <div className="dashboard-grid">
        <div className="dashboard-main">
          <h2 className="section-title">Comparison Results</h2>
          <p className="section-sub">
            Showing the best rates for £{amount.toLocaleString()} from United Kingdom to Nigeria
          </p>

          <ComparisonTable routes={data?.routes || []} loading={loading} />

          {savings > 0 && (
            <div className="savings-banner">
              <span className="savings-icon">💡</span>
              <div>
                <strong>You could get ₦{savings.toLocaleString()} more with {best.provider}!</strong>
                <p>Compared to the bank, you'll receive ₦{best.received.toLocaleString()} instead of ₦{worst.received.toLocaleString()}.</p>
              </div>
              <button className="btn-outline">See Details →</button>
            </div>
          )}

          <h3 className="section-title" style={{ marginTop: 32 }}>Popular Corridors</h3>
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

        {/* Right column */}
        <aside className="dashboard-side">
          <div className="side-card">
            <h3>📤 Transfer Summary</h3>
            <div className="summary-row"><span>From</span><strong>🇬🇧 United Kingdom (GBP)</strong></div>
            <div className="summary-row"><span>To</span><strong>🇳🇬 Nigeria (NGN)</strong></div>
            <div className="summary-row"><span>Amount</span><strong>£{amount.toLocaleString()}</strong></div>
            {best && (
              <div className="best-option-box">
                <div className="bo-label">Best Option</div>
                <div className="bo-provider">{best.provider}</div>
                <div className="bo-amount">You'll receive ₦{best.received.toLocaleString()}</div>
              </div>
            )}
          </div>

          <div className="side-card">
            <h3>📈 Rate Trend <span className="muted">(Last 7 days)</span></h3>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={MOCK_TREND}>
                <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                <YAxis tick={{ fontSize: 10 }} stroke="#9CA3AF" domain={['dataMin - 50', 'dataMax + 50']} />
                <Tooltip />
                <Line type="monotone" dataKey="rate" stroke="#7C3AED" strokeWidth={2.5} dot={{ r: 3, fill: '#7C3AED' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="side-card safety">
            <div className="safety-icon">🛡️</div>
            <h3>Stay safe. Always.</h3>
            <p>We show you reliability scores based on merchant history, reviews and completion rates.</p>
            <a href="#">Learn more →</a>
          </div>
        </aside>
      </div>
    </div>
  )
}