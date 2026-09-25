import { CORRIDORS, FLAG_ISO } from '../constants'
import './CorridorSelector.css'

export default function CorridorSelector({ corridor, setCorridor, amount, setAmount, onCompare, loading }) {
  const selected = CORRIDORS.find((c) => c.value === corridor) || CORRIDORS[0]
  const fromISO = FLAG_ISO[selected.fromCode] || 'un'
  const toISO = FLAG_ISO[selected.toCode] || 'un'

  return (
    <div className="selector">
      <div className="selector-field">
        <label>From</label>
        <div className="select-wrap">
          <img src={`https://flagcdn.com/w20/${fromISO}.png`} alt="" className="select-flag" />
          <select value={corridor} onChange={(e) => setCorridor(e.target.value)}>
            {CORRIDORS.map((c) => (
              <option key={c.value} value={c.value}>{c.fromLabel}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="selector-field">
        <label>To</label>
        <div className="select-wrap">
          <img src={`https://flagcdn.com/w20/${toISO}.png`} alt="" className="select-flag" />
          <select disabled value={corridor}>
            <option>{selected.toLabel}</option>
          </select>
        </div>
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