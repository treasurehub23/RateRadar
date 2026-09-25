import { Search, Home, Bell, Globe, Bookmark } from 'lucide-react'
import './PhoneShowcase.css'

function PhoneFrame({ children }) {
  return (
    <div className="ps-phone">
      <div className="ps-notch" />
      <div className="ps-status">
        <span>9:41</span>
        <span>●●●</span>
      </div>
      <div className="ps-screen">{children}</div>
    </div>
  )
}

function ScreenCreateAccount() {
  return (
    <div className="ps-body">
      <div className="ps-logo">
        <span className="ps-logo-mark">▲</span>
        <strong>RateRadar</strong>
      </div>
      <h4>Create account</h4>
      <p className="ps-sub">Get started in seconds</p>
      <div className="ps-field">👤 Full name</div>
      <div className="ps-field">✉ Email address</div>
      <div className="ps-field">🔒 Password</div>
      <button className="ps-btn">Create account →</button>
    </div>
  )
}

function ScreenCorridors() {
  return (
    <div className="ps-body">
      <h4>Corridors</h4>
      <p className="ps-sub">Your saved money transfer routes</p>
      <div className="ps-pills">
        <span className="ps-pill active">All</span>
        <span className="ps-pill">Popular</span>
        <span className="ps-pill">Saved</span>
      </div>
      <div className="ps-corridor">
        <img src="https://flagcdn.com/w20/gb.png" alt="" />
        <img src="https://flagcdn.com/w20/ng.png" alt="" />
        <span className="ps-corridor-label">UK → Nigeria</span>
        <strong>₦1,580,000</strong>
      </div>
      <div className="ps-corridor">
        <img src="https://flagcdn.com/w20/us.png" alt="" />
        <img src="https://flagcdn.com/w20/ng.png" alt="" />
        <span className="ps-corridor-label">USA → Nigeria</span>
        <strong>₦1,620,000</strong>
      </div>
      <div className="ps-corridor">
        <img src="https://flagcdn.com/w20/ca.png" alt="" />
        <img src="https://flagcdn.com/w20/ng.png" alt="" />
        <span className="ps-corridor-label">Canada → Nigeria</span>
        <strong>₦1,590,000</strong>
      </div>
      <div className="ps-tabbar">
        <Home size={14} className="active" />
        <Bell size={14} />
        <Globe size={14} />
        <Bookmark size={14} />
      </div>
    </div>
  )
}

export default function PhoneShowcase() {
  return (
    <section className="phone-showcase">
      <div className="ps-row">
        <div className="ps-visual">
          <div className="ps-phone-back">
            <PhoneFrame><ScreenCreateAccount /></PhoneFrame>
          </div>

          <div className="ps-phone-front">
            <PhoneFrame><ScreenCorridors /></PhoneFrame>
          </div>

          <div className="ps-search">
            <div className="ps-search-bar">
              <span className="ps-search-input">
                <Search size={14} />
                <span>Search corridors...</span>
              </span>
              <span className="ps-close">×</span>
            </div>

            <div className="ps-search-head">
              <strong>14 Results</strong>
              <span className="ps-filter">Popular</span>
              <span className="ps-filter">Saved</span>
            </div>

            <div className="ps-results-row">
              <div className="ps-result-card">
                <div className="ps-flags">
                  <img src="https://flagcdn.com/w40/gb.png" alt="" />
                  <img src="https://flagcdn.com/w40/ng.png" alt="" />
                </div>
                <div className="ps-result-name">UK → Nigeria</div>
                <div className="ps-result-amt">₦1,680,000</div>
              </div>

              <div className="ps-result-card">
                <div className="ps-flags">
                  <img src="https://flagcdn.com/w40/us.png" alt="" />
                  <img src="https://flagcdn.com/w40/gh.png" alt="" />
                </div>
                <div className="ps-result-name">USA → Ghana</div>
                <div className="ps-result-amt">GH₵15,600</div>
              </div>

              <div className="ps-result-card">
                <div className="ps-flags">
                  <img src="https://flagcdn.com/w40/ca.png" alt="" />
                  <img src="https://flagcdn.com/w40/ke.png" alt="" />
                </div>
                <div className="ps-result-name">Canada → Kenya</div>
                <div className="ps-result-amt">KSh 95,500</div>
              </div>
            </div>
          </div>
        </div>

        <div className="ps-text">
          <h2>One app. Every corridor.</h2>
          <p>RateRadar works on any device. Compare live rates, track alerts, save corridors — all in your pocket.</p>
        </div>
      </div>
    </section>
  )
}