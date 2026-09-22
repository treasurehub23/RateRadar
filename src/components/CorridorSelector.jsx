import './CorridorSelector.css'

const CORRIDORS = [
  { value: 'UK-NG', from: '🇬🇧 United Kingdom (GBP)', to: '🇳🇬 Nigeria (NGN)', currency: '£' },
  { value: 'USA-NG', from: '🇺🇸 USA (USD)', to: '🇳🇬 Nigeria (NGN)', currency: '$' },
  { value: 'CAD-NG', from: '🇨🇦 Canada (CAD)', to: '🇳🇬 Nigeria (NGN)', currency: 'C$' },
  { value: 'EU-NG', from: '🇪🇺 EU (EUR)', to: '🇳🇬 Nigeria (NGN)', currency: '€' },
  { value: 'USA-KE', from: '🇺🇸 USA (USD)', to: '🇰🇪 Kenya (KES)', currency: '$' },
]

export default function CorridorSelector({ corridor, setCorridor, amount, setAmount, onCompare, loading }) {
  const selected = CORRIDORS.find((c) => c.value === corridor) || CORRIDORS[0]

  return (
    <div className="selector">
      <div className="selector-field">
        <label>From</label>
        <select value={corridor} onChange={(e) => setCorridor(e.target.value)}>
          {CORRIDORS.map((c) => (
            <option key={c.value} value={c.value}>{c.from}</option>
          ))}
        </select>
      </div>

      <div className="selector-field">
        <label>To</label>
        <select disabled value={corridor}>
          <option>{selected.to}</option>
        </select>
      </div>

      <div className="selector-field amount">
        <label>Amount</label>
        <div className="amount-input">
          <span>{selected.currency}</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>
      </div>

      <button className="btn-primary" onClick={onCompare} disabled={loading}>
        {loading ? 'Comparing...' : 'Compare →'}
      </button>
    </div>
  )
}