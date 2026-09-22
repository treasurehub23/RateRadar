import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, LogOut, User } from 'lucide-react'
import './Header.css'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header className="topbar">
      <div className="topbar-spacer" />

      {!loggedIn && (
        <div className="auth-buttons">
          <button className="btn-signin" onClick={() => navigate('/signin')}>Sign In</button>
          <button className="btn-signup" onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
      )}

      {loggedIn && (
        <>
        <ThemeToggle />
          <button className="topbar-bell"><Bell size={20} strokeWidth={1.8} /></button>

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