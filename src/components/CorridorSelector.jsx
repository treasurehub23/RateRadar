import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { CORRIDORS, FLAG_ISO } from '../constants'
import './CorridorSelector.css'

const FROM_COUNTRIES = [
  { code: 'GBP', label: 'United Kingdom', currency: '£' },
  { code: 'USD', label: 'USA', currency: '$' },
  { code: 'CAD', label: 'Canada', currency: 'C$' },
  { code: 'EUR', label: 'EU', currency: '€' },
  { code: 'AUD', label: 'Australia', currency: 'A$' },
  { code: 'AED', label: 'UAE', currency: 'د.إ' },
]

const TO_COUNTRIES = [
  { code: 'NGN', label: 'Nigeria' },
  { code: 'KES', label: 'Kenya' },
  { code: 'GHS', label: 'Ghana' },
  { code: 'ZAR', label: 'South Africa' },
]

export default function CorridorSelector({ corridor, setCorridor, amount, setAmount, onCompare, loading }) {
  const current = CORRIDORS.find((c) => c.value === corridor) || CORRIDORS[0]
  const [fromCode, setFromCode] = useState(current.fromCode)
  const [toCode, setToCode] = useState(current.toCode)

  const fromMeta = FROM_COUNTRIES.find((c) => c.code === fromCode) || FROM_COUNTRIES[0]

  const handleFromChange = (code) => {
    setFromCode(code)
    const match = CORRIDORS.find((c) => c.fromCode === code && c.toCode === toCode)
    if (match) setCorridor(match.value)
  }

  const handleToChange = (code) => {
    setToCode(code)
    const match = CORRIDORS.find((c) => c.fromCode === fromCode && c.toCode === code)
    if (match) setCorridor(match.value)
  }

  return (
    <div className="selector">
      <div className="selector-field">
        <label>From</label>
        <div className="select-wrap">
          <img src={`https://flagcdn.com/w40/${FLAG_ISO[fromCode]}.png`} alt="" className="select-flag" />
          <select value={fromCode} onChange={(e) => handleFromChange(e.target.value)}>
            {FROM_COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>{c.label} ({c.code})</option>
            ))}
          </select>
          <ChevronDown size={16} className="select-chevron" />
        </div>
      </div>

      <div className="selector-field">
        <label>To</label>
        <div className="select-wrap">
          <img src={`https://flagcdn.com/w40/${FLAG_ISO[toCode]}.png`} alt="" className="select-flag" />
          <select value={toCode} onChange={(e) => handleToChange(e.target.value)}>
            {TO_COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>{c.label} ({c.code})</option>
            ))}
          </select>
          <ChevronDown size={16} className="select-chevron" />
        </div>
      </div>

      <div className="selector-field amount">
        <label>Amount</label>
        <div className="amount-input">
          <span>{fromMeta.currency}</span>
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