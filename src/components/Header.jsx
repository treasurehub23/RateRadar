import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, LogOut, User, Moon, Sun } from 'lucide-react'
import './Header.css'

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState('light')
  const menuRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'light'
    setTheme(saved)
    document.documentElement.setAttribute('data-theme', saved)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('theme', next)
  }

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <svg viewBox="0 0 40 40" width="34" height="34" fill="none">
          <defs>
            <linearGradient id="hPlaneLight" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8B7CF8" />
              <stop offset="100%" stopColor="#6D5CE7" />
            </linearGradient>
            <linearGradient id="hPlaneDark" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#3730A3" />
            </linearGradient>
          </defs>
          <path d="M 5 20 L 34 4 L 20 24 Z" fill="url(#hPlaneLight)" />
          <path d="M 34 4 L 20 24 L 24 36 L 30 30 Z" fill="url(#hPlaneDark)" />
          <path d="M 34 4 L 20 24 L 24 22 Z" fill="#FFFFFF" opacity="0.9" />
        </svg>
        <span>RateRadar</span>
      </div>

      <div className="topbar-spacer" />

      <button className="topbar-theme" onClick={toggleTheme} title="Toggle theme">
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {!loggedIn && (
        <div className="auth-buttons">
          <button className="btn-signin" onClick={() => navigate('/signin')}>Sign In</button>
          <button className="btn-signup" onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
      )}

      {loggedIn && (
        <>
          <button className="topbar-bell">
            <Bell size={20} strokeWidth={1.8} />
          </button>

          <div className="topbar-user-wrap" ref={menuRef}>
            <button className="topbar-user" onClick={() => setMenuOpen(!menuOpen)}>
              <div className="topbar-avatar">FA</div>
              <span>Faith</span>
              <ChevronDown size={16} strokeWidth={2} className={menuOpen ? 'rotate' : ''} />
            </button>

            {menuOpen && (
              <div className="user-menu">
                <button className="menu-item" onClick={() => { navigate('/profile'); setMenuOpen(false) }}>
                  <User size={16} /> Profile
                </button>
                <div className="menu-divider" />
                <button className="menu-item danger" onClick={() => { setLoggedIn(false); setMenuOpen(false); navigate('/signin') }}>
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </header>
  )
}