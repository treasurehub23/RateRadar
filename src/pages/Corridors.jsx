import { useEffect, useState } from 'react'
import { MoreVertical } from 'lucide-react'
import { getSavedCorridors } from '../api'
import { FLAG_ISO } from '../constants'
import './Corridors.css'

export default function Corridors() {
  const [corridors, setCorridors] = useState([])

  useEffect(() => {
    setCorridors(getSavedCorridors())
  }, [])

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>🌍 My Corridors</h1>
          <p>Save your frequently used corridors for quick access.</p>
        </div>
        <button className="btn-primary">+ Add Corridor</button>
      </div>

      <div className="corridors-list">
        {corridors.map((c) => {
          const fromISO = FLAG_ISO[c.fromCode] || 'un'
          const toISO = FLAG_ISO[c.toCode] || 'un'
          return (
            <div key={c.id} className="corridor-row">
              <div className="corridor-flags">
                <img
                  src={`https://flagcdn.com/w40/${fromISO}.png`}
                  alt={c.fromCode}
                  className="corridor-flag-img"
                />
                <span className="arrow">→</span>
                <img
                  src={`https://flagcdn.com/w40/${toISO}.png`}
                  alt={c.toCode}
                  className="corridor-flag-img"
                />
              </div>

              <div className="corridor-label">
                <div className="corridor-name">
                  {c.label}
                  {c.default && <span className="default-tag">Default</span>}
                </div>
                <div className="corridor-code">{c.fromCode} → {c.toCode}</div>
              </div>

              <div className="corridor-last">Last used: {c.lastUsed}</div>
              <button className="btn-view">Compare</button>
              <button className="btn-more"><MoreVertical size={16} /></button>
            </div>
          )
        })}
      </div>
    </div>
  )
}