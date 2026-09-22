import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MoreVertical, Plus, X } from 'lucide-react'
import { getCorridors } from '../api'
import { FLAG_ISO, CORRIDORS } from '../constants'
import './Corridors.css'

export default function Corridors() {
  const [corridors, setCorridors] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [pick, setPick] = useState(CORRIDORS[0].value)
  const navigate = useNavigate()

  useEffect(() => {
    getCorridors().then((data) => {
      const saved = JSON.parse(localStorage.getItem('savedCorridors') || 'null')
      setCorridors(saved || data)
    })
  }, [])

  const persist = (next) => {
    setCorridors(next)
    localStorage.setItem('savedCorridors', JSON.stringify(next))
  }

  const handleAdd = () => {
    const c = CORRIDORS.find((x) => x.value === pick)
    if (!c) return
    if (corridors.some((x) => x.fromCode === c.fromCode && x.toCode === c.toCode)) {
      setShowAdd(false)
      return
    }
    const next = [
      ...corridors,
      {
        id: Date.now(),
        fromCode: c.fromCode,
        toCode: c.toCode,
        fromLabel: c.fromLabel,
        toLabel: c.toLabel,
        lastUsed: '—',
      },
    ]
    persist(next)
    setShowAdd(false)
  }

  const handleRemove = (id) => {
    persist(corridors.filter((c) => c.id !== id))
  }

  const handleCompare = (c) => {
    navigate(`/dashboard?corridor=${c.fromCode}-${c.toCode}`)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>🌍 My Corridors</h1>
          <p>Save your frequently used corridors for quick access.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Add Corridor
        </button>
      </div>

      <div className="corridors-list">
        {corridors.map((c) => {
          const fromISO = FLAG_ISO[c.fromCode] || 'un'
          const toISO = FLAG_ISO[c.toCode] || 'un'
          return (
            <div key={c.id} className="corridor-row">
              <div className="corridor-flags">
                <img src={`https://flagcdn.com/w40/${fromISO}.png`} alt={c.fromCode} className="corridor-flag-img" />
                <span className="arrow">→</span>
                <img src={`https://flagcdn.com/w40/${toISO}.png`} alt={c.toCode} className="corridor-flag-img" />
              </div>

              <div className="corridor-label">
                <div className="corridor-name">
                  {c.fromLabel?.split(' (')[0] || c.fromCode} → {c.toLabel?.split(' (')[0] || c.toCode}
                  {c.default && <span className="default-tag">Default</span>}
                </div>
                <div className="corridor-code">{c.fromCode} → {c.toCode}</div>
              </div>

              <div className="corridor-last">Last used: {c.lastUsed}</div>
              <button className="btn-view" onClick={() => handleCompare(c)}>Compare</button>
              <button className="btn-more" onClick={() => handleRemove(c.id)}>
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>

      {showAdd && (
        <div className="modal-backdrop" onClick={() => setShowAdd(false)}>
          <div className="modal-card add-corridor-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAdd(false)}>
              <X size={18} />
            </button>
            <h2>Add Corridor</h2>
            <p>Choose a corridor to add to your saved list.</p>
            <div className="add-corridor-select">
              {CORRIDORS.map((c) => {
                const fromISO = FLAG_ISO[c.fromCode] || 'un'
                const toISO = FLAG_ISO[c.toCode] || 'un'
                return (
                  <button
                    key={c.value}
                    className={`corridor-option ${pick === c.value ? 'selected' : ''}`}
                    onClick={() => setPick(c.value)}
                  >
                    <img src={`https://flagcdn.com/w40/${fromISO}.png`} alt="" />
                    <span>{c.fromLabel.split(' (')[0]} → {c.toLabel.split(' (')[0]}</span>
                    <span className="code">{c.fromCode} → {c.toCode}</span>
                  </button>
                )
              })}
            </div>
            <div className="modal-actions">
              <button className="btn-outline-modal" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn-primary-modal" onClick={handleAdd}>Add Corridor</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}