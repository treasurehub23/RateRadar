import { NavLink } from 'react-router-dom'
import { Home, Bell, Globe, Bookmark, Zap } from 'lucide-react'
import './Sidebar.css'

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">
          <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
            <defs>
              <linearGradient id="planeGradLight" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8B7CF8" />
                <stop offset="100%" stopColor="#6D5CE7" />
              </linearGradient>
              <linearGradient id="planeGradDark" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4F46E5" />
                <stop offset="100%" stopColor="#3730A3" />
              </linearGradient>
            </defs>
            <path d="M 5 20 L 34 4 L 20 24 Z" fill="url(#planeGradLight)" />
            <path d="M 34 4 L 20 24 L 24 36 L 30 30 Z" fill="url(#planeGradDark)" />
            <path d="M 34 4 L 20 24 L 24 22 Z" fill="#FFFFFF" opacity="0.9" />
          </svg>
        </div>
        <span>RateRadar</span>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><Home size={18} strokeWidth={2} /> Home</NavLink>
        <NavLink to="/alerts" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><Bell size={18} strokeWidth={2} /> Alerts<span className="nav-badge">3</span></NavLink>
        <NavLink to="/corridors" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><Globe size={18} strokeWidth={2} /> Corridors</NavLink>
        <NavLink to="/saved" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><Bookmark size={18} strokeWidth={2} /> Saved</NavLink>
      </nav>
      <div className="sidebar-promo">
        <div className="promo-icon"><Zap size={16} strokeWidth={2.2} /></div>
        <h4>Smarter transfers. Better rates.</h4>
        <p>Get the best exchange rates and save more on every transfer.</p>
      </div>
      <div className="sidebar-user">
        <div className="user-avatar">FA</div>
        <div>
          <div className="user-name">Faith A.</div>
          <div className="user-plan">Free Plan</div>
        </div>
      </div>
    </aside>
  )
}