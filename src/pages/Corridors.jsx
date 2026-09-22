import { useEffect, useState } from 'react'
import { getCorridors } from '../api'
import './Corridors.css'

export default function Corridors() {
  const [corridors, setCorridors] = useState([])

  useEffect(() => { getCorridors().then(setCorridors) }, [])

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
        {corridors.map((c) => (
          <div key={c.id} className="corridor-row">
            <div className="corridor-flags">
              <span>{c.fromFlag}</span>
              <span className="arrow">→</span>
              <span>{c.toFlag}</span>
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
            <button className="btn-more">⋯</button>
          </div>
        ))}
      </div>
    </div>
  )
}