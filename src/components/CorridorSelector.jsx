import { COUNTRIES, getCountryByCurrency } from '../constants'
import './CorridorSelector.css'

export default function CorridorSelector({
  fromCode,
  setFromCode,
  toCode,
  setToCode,
  amount,
  setAmount,
  onCompare,
  loading,
}) {
  const fromCountry = getCountryByCurrency(fromCode)
  const toCountry = getCountryByCurrency(toCode)

  return (
    <div className="selector">
      <div className="selector-field">
        <label>From</label>
        <div className="select-wrap">
          <img
            src={`https://flagcdn.com/w20/${fromCountry.iso}.png`}
            alt=""
            className="select-flag"
          />
          <select value={fromCode} onChange={(e) => setFromCode(e.target.value)}>
            {COUNTRIES.map((c) => (
              <option key={c.currency} value={c.currency}>
                {c.name} ({c.currency})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="selector-field">
        <label>To</label>
        <div className="select-wrap">
          <img
            src={`https://flagcdn.com/w20/${toCountry.iso}.png`}
            alt=""
            className="select-flag"
          />
          <select value={toCode} onChange={(e) => setToCode(e.target.value)}>
            {COUNTRIES.map((c) => (
              <option key={c.currency} value={c.currency}>
                {c.name} ({c.currency})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="selector-field amount">
        <label>Amount</label>
        <div className="amount-input">
          <span>{fromCountry.symbol}</span>
          <input
  type="number"
  value={amount === 0 ? '' : amount}
  onChange={(e) => setAmount(Number(e.target.value) || 0)}
  placeholder="Enter amount"
/>
        </div>
      </div>

      <button className="btn-primary" onClick={onCompare} disabled={loading}>
        {loading ? 'Comparing...' : 'Compare →'}
      </button>
    </div>
  )
}