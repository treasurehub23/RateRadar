import { Mail, Globe, Send, Share2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-logo">
            <svg viewBox="0 0 40 40" width="32" height="32" fill="none">
              <defs>
                <linearGradient id="fPlaneLight" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#8B7CF8" />
                  <stop offset="100%" stopColor="#6D5CE7" />
                </linearGradient>
                <linearGradient id="fPlaneDark" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#3730A3" />
                </linearGradient>
              </defs>
              <path d="M 5 20 L 34 4 L 20 24 Z" fill="url(#fPlaneLight)" />
              <path d="M 34 4 L 20 24 L 24 36 L 30 30 Z" fill="url(#fPlaneDark)" />
              <path d="M 34 4 L 20 24 L 24 22 Z" fill="#FFFFFF" opacity="0.9" />
            </svg>
            <span>RateRadar</span>
          </div>
          <p className="footer-tag">Smarter transfers. Better rates. Built for African corridors.</p>
        </div>

        <div className="footer-cols">
          <div className="footer-col">
            <h5>Product</h5>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/alerts">Alerts</Link>
            <Link to="/corridors">Corridors</Link>
            <Link to="/profile">Profile</Link>
          </div>

          <div className="footer-col">
            <h5>Corridors</h5>
            <a href="/">UK → Nigeria</a>
            <a href="/">USA → Ghana</a>
            <a href="/">Canada → Kenya</a>
            <a href="/">EU → Nigeria</a>
          </div>

          <div className="footer-col">
            <h5>Resources</h5>
            <a href="/">Blog</a>
            <a href="/">Rate reports</a>
            <a href="/">API docs</a>
            <a href="/">Help center</a>
          </div>

          <div className="footer-col">
            <h5>Company</h5>
            <a href="/">About</a>
            <a href="/">Careers</a>
            <a href="/">Press</a>
            <a href="/">Contact</a>
          </div>

          <div className="footer-col">
            <h5>Legal</h5>
            <a href="/">Privacy</a>
            <a href="/">Terms</a>
            <a href="/">Security</a>
            <a href="/">Compliance</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 RateRadar. All rights reserved.</span>
        <div className="footer-social">
          <a href="/" aria-label="Twitter"><Send size={16} /></a>
          <a href="/" aria-label="LinkedIn"><Share2 size={16} /></a>
          <a href="/" aria-label="Website"><Globe size={16} /></a>
          <a href="/" aria-label="Email"><Mail size={16} /></a>
        </div>
      </div>
    </footer>
  )
}