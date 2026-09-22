import { NavLink } from 'react-router-dom'
import './Sidebar.css'

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">▲</div>
        <span>RateRadar</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">🏠</span> Home
        </NavLink>
        <NavLink to="/alerts" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">🔔</span> Alerts
          <span className="nav-badge">3</span>
        </NavLink>
        <NavLink to="/corridors" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">🌍</span> Corridors
        </NavLink>
        <NavLink to="/saved" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">🔖</span> Saved
        </NavLink>
      </nav>

      <div className="sidebar-promo">
        <div className="promo-icon">⚡</div>
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