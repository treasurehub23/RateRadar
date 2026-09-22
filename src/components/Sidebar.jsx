import { NavLink } from 'react-router-dom'
import { Home, Bell, Globe, Bookmark, Zap } from 'lucide-react'
import './Sidebar.css'

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">▲</div>
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