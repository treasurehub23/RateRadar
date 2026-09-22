import { Mail, Phone, MapPin, Calendar, Shield, Save } from 'lucide-react'
import './Profile.css'

export default function Profile() {
  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-cover" />
        <div className="profile-info">
          <div className="profile-avatar-lg">FA</div>
          <div className="profile-meta">
            <h1>Faith Adeyemi</h1>
            <p>faith@example.com · Joined Aug 2025</p>
          </div>
          <button className="btn-primary">Edit Profile</button>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <h3>Account Details</h3>
          <div className="info-row"><Mail size={16} /><div><label>Email</label><p>faith@example.com</p></div></div>
          <div className="info-row"><Phone size={16} /><div><label>Phone</label><p>+44 7911 123456</p></div></div>
          <div className="info-row"><MapPin size={16} /><div><label>Location</label><p>London, United Kingdom</p></div></div>
          <div className="info-row"><Calendar size={16} /><div><label>Member since</label><p>August 20, 2025</p></div></div>
        </div>

        <div className="profile-card">
          <h3>Security</h3>
          <div className="info-row"><Shield size={16} /><div><label>Password</label><p>Last changed 3 months ago</p></div><button className="btn-link">Change</button></div>
          <div className="info-row"><Shield size={16} /><div><label>Two-factor auth</label><p>Not enabled</p></div><button className="btn-link">Enable</button></div>
        </div>

        <div className="profile-card">
          <h3>Preferences</h3>
          <div className="pref-row">
            <label>Default currency</label>
            <select defaultValue="GBP"><option>GBP</option><option>USD</option><option>EUR</option><option>NGN</option></select>
          </div>
          <div className="pref-row">
            <label>Alert threshold</label>
            <select defaultValue="5"><option value="3">3%</option><option value="5">5%</option><option value="10">10%</option></select>
          </div>
          <div className="pref-row">
            <label>Email notifications</label>
            <input type="checkbox" defaultChecked />
          </div>
          <button className="btn-primary" style={{ marginTop: 12 }}><Save size={14} /> Save Changes</button>
        </div>
      </div>
    </div>
  )
}