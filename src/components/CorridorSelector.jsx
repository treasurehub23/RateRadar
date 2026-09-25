import { CORRIDORS, FLAG_ISO } from '../constants'
import './CorridorSelector.css'

export default function CorridorSelector({ corridor, setCorridor, amount, setAmount, onCompare, loading }) {
  const selected = CORRIDORS.find((c) => c.value === corridor) || CORRIDORS[0]
  const fromISO = FLAG_ISO[selected.fromCode] || 'un'
  const toISO = FLAG_ISO[selected.toCode] || 'un'

  // Unique "from" options (one per source country/currency)
  const fromOptions = CORRIDORS.filter(
    (c, i, arr) => arr.findIndex((x) => x.fromCode === c.fromCode) === i
  )

  // Only "to" options that actually exist for the selected "from"
  const toOptions = CORRIDORS.filter((c) => c.fromCode === selected.fromCode)

  const handleFromChange = (fromCode) => {
    // Pick the first corridor that matches the new "from"
    const next = CORRIDORS.find((c) => c.fromCode === fromCode)
    if (next) setCorridor(next.value)
  }

  const handleToChange = (toCode) => {
    // Find corridor matching current "from" + chosen "to"
    const next = CORRIDORS.find(
      (c) => c.fromCode === selected.fromCode && c.toCode === toCode
    )
    if (next) setCorridor(next.value)
  }

  return (
    <div className="selector">
      <div className="selector-field">
        <label>From</label>
        <div className="select-wrap">
          <img src={`https://flagcdn.com/w20/${fromISO}.png`} alt="" className="select-flag" />
          <select
            value={selected.fromCode}
            onChange={(e) => handleFromChange(e.target.value)}
          >
            {fromOptions.map((c) => (
              <option key={c.fromCode} value={c.fromCode}>
                {c.fromLabel}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="selector-field">
        <label>To</label>
        <div className="select-wrap">
          <img src={`https://flagcdn.com/w20/${toISO}.png`} alt="" className="select-flag" />
          <select
            value={selected.toCode}
            onChange={(e) => handleToChange(e.target.value)}
            disabled={toOptions.length <= 1}
          >
            {toOptions.map((c) => (
              <option key={c.toCode} value={c.toCode}>
                {c.toLabel}
              </option>
            ))}
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