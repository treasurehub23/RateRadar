import { useState } from 'react'
import { Mail, Phone, MapPin, Calendar, Shield, Save, Edit3, Share2, Globe, CheckCircle, TrendingUp, Bookmark, Bell, X } from 'lucide-react'
import './Profile.css'

const INITIAL = {
  name: 'Faith Atigah',
  pronouns: '(she/her)',
  role: 'Product Designer · RateRadar Member',
  email: 'atigahfaith44@gmail.com',
  phone: '+234 916 892 6544',
  location: 'Lagos, Nigeria',
  memberSince: 'August 20, 2024',
  bio: "I send money home to Nigeria every month. RateRadar helps me spot the ₦40,000–₦80,000 I used to lose to bank rates and hidden fees. If you're in the diaspora and sending regularly, you know what I mean.",
  handle: 'faith-atigah',
}

export default function Profile() {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('profile_data')
    return saved ? JSON.parse(saved) : INITIAL
  })
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(profile)
  const [saved, setSaved] = useState(false)

  const startEdit = () => {
    setDraft(profile)
    setEditing(true)
  }

  const cancelEdit = () => {
    setDraft(profile)
    setEditing(false)
  }

  const saveEdit = () => {
    setProfile(draft)
    localStorage.setItem('profile_data', JSON.stringify(draft))
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const update = (key, value) => setDraft((d) => ({ ...d, [key]: value }))

  const initials = profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="profile-page">
      {saved && (
        <div className="profile-toast">
          <CheckCircle size={16} /> Profile updated
        </div>
      )}

      {/* COVER + HEADER */}
      <div className="profile-cover-card">
        <div className="profile-cover">
          <svg className="cover-pattern" viewBox="0 0 1200 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="coverGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#A78BFA" />
              </linearGradient>
            </defs>
            <rect width="1200" height="200" fill="url(#coverGrad)" />

            {/* Sparkles */}
            <g fill="#FFFFFF">
              <path d="M 140 60 l 2 -10 l 2 10 l 10 2 l -10 2 l -2 10 l -2 -10 l -10 -2 z" opacity="0.9" />
              <path d="M 380 40 l 1.5 -7 l 1.5 7 l 7 1.5 l -7 1.5 l -1.5 7 l -1.5 -7 l -7 -1.5 z" opacity="0.7" />
              <path d="M 720 90 l 2 -9 l 2 9 l 9 2 l -9 2 l -2 9 l -2 -9 l -9 -2 z" opacity="0.8" />
              <path d="M 950 50 l 1.5 -8 l 1.5 8 l 8 1.5 l -8 1.5 l -1.5 8 l -1.5 -8 l -8 -1.5 z" opacity="0.85" />
              <path d="M 1100 120 l 2 -10 l 2 10 l 10 2 l -10 2 l -2 10 l -2 -10 l -10 -2 z" opacity="0.75" />
              <circle cx="260" cy="150" r="2" opacity="0.6" />
              <circle cx="560" cy="55" r="1.5" opacity="0.7" />
              <circle cx="860" cy="140" r="2" opacity="0.65" />
              <circle cx="1050" cy="70" r="1.5" opacity="0.8" />
              <circle cx="180" cy="110" r="1.2" opacity="0.5" />
              <circle cx="640" cy="160" r="1.5" opacity="0.55" />
              <circle cx="980" cy="30" r="1.2" opacity="0.7" />
            </g>

            {/* Faint waves */}
            <path d="M 0 140 Q 200 100 400 140 T 800 140 T 1200 140" stroke="rgba(255,255,255,0.12)" strokeWidth="2" fill="none" />
            <path d="M 0 170 Q 200 130 400 170 T 800 170 T 1200 170" stroke="rgba(255,255,255,0.08)" strokeWidth="2" fill="none" />
            <circle cx="1080" cy="40" r="70" fill="rgba(255,255,255,0.06)" />
            <circle cx="140" cy="170" r="55" fill="rgba(255,255,255,0.05)" />
          </svg>
        </div>

        <div className="profile-header-body">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar-xl">{initials}</div>
            <span className="profile-verified" title="Verified"><CheckCircle size={16} /></span>
          </div>

          <div className="profile-head-info">
            <div className="profile-head-row">
              <div>
                <h1>{profile.name} <span className="pronouns">{profile.pronouns}</span></h1>
                <p className="profile-role">{profile.role}</p>
              </div>
              <div className="profile-head-actions">
                <button className="btn-primary-sm" onClick={startEdit}><Edit3 size={14} /> Edit Profile</button>
                <button className="btn-ghost-sm"><Share2 size={14} /> Share</button>
              </div>
            </div>

            <div className="profile-meta-row">
              <span><MapPin size={13} /> {profile.location}</span>
              <span><Mail size={13} /> {profile.email}</span>
              <span><Phone size={13} /> {profile.phone}</span>
              <span><Calendar size={13} /> Joined {profile.memberSince}</span>
            </div>

            <div className="profile-tags">
              <span className="tag tag-purple">NGN Base</span>
              <span className="tag">UK → NG</span>
              <span className="tag">Premium alerts on</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="profile-grid">
        <div className="profile-main">
          <div className="profile-section">
            <h3>About</h3>
            <p className="profile-about-text">{profile.bio}</p>
          </div>

          <div className="profile-section">
            <h3>Account Details</h3>
            <div className="detail-list">
              <div className="detail-item">
                <Mail size={16} />
                <div><label>Email</label><p>{profile.email}</p></div>
              </div>
              <div className="detail-item">
                <Phone size={16} />
                <div><label>Phone</label><p>{profile.phone}</p></div>
              </div>
              <div className="detail-item">
                <MapPin size={16} />
                <div><label>Location</label><p>{profile.location}</p></div>
              </div>
              <div className="detail-item">
                <Calendar size={16} />
                <div><label>Member since</label><p>{profile.memberSince}</p></div>
              </div>
            </div>
          </div>

          {/* SAVED CORRIDORS */}
          <div className="profile-section">
            <h3>Saved Corridors</h3>
            <div className="saved-corridors-list">
              {[
                { from: 'gb', to: 'ng', label: 'UK → Nigeria', code: 'GBP → NGN', used: 'Used today', last: '₦1,680,000' },
                { from: 'us', to: 'gh', label: 'USA → Ghana', code: 'USD → GHS', used: 'Used 3 days ago', last: 'GH₵15,600' },
                { from: 'ca', to: 'ke', label: 'Canada → Kenya', code: 'CAD → KES', used: 'Used last week', last: 'KSh 95,500' },
                { from: 'eu', to: 'ng', label: 'EU → Nigeria', code: 'EUR → NGN', used: 'Used 2 weeks ago', last: '₦1,720,000' },
              ].map((c) => (
                <div key={c.code} className="saved-corridor-item">
                  <div className="saved-flags">
                    <img src={`https://flagcdn.com/w40/${c.from}.png`} alt="" />
                    <span>→</span>
                    <img src={`https://flagcdn.com/w40/${c.to}.png`} alt="" />
                  </div>
                  <div className="saved-info">
                    <div className="saved-label">{c.label}</div>
                    <div className="saved-code">{c.code} · {c.used}</div>
                  </div>
                  <div className="saved-amount">{c.last}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="profile-section">
            <h3>Preferences</h3>
            <div className="pref-list">
              <div className="pref-row">
                <label>Default currency</label>
                <select defaultValue="NGN">
                  <option>NGN</option>
                  <option>GBP</option>
                  <option>USD</option>
                  <option>EUR</option>
                </select>
              </div>
              <div className="pref-row">
                <label>Alert threshold</label>
                <select defaultValue="5">
                  <option value="3">3%</option>
                  <option value="5">5%</option>
                  <option value="10">10%</option>
                  <option value="15">15%</option>
                </select>
              </div>
              <div className="pref-row">
                <label>Email notifications</label>
                <input type="checkbox" defaultChecked />
              </div>
            </div>
            <button className="btn-primary-sm mt-2"><Save size={14} /> Save Changes</button>
          </div>
        </div>

        <aside className="profile-side">
          <div className="side-card">
            <div className="side-card-head">
              <h4>Public profile & URL</h4>
              <Edit3 size={14} />
            </div>
            <p className="public-url">rateradar.app/<strong>{profile.handle}</strong></p>
            <div className="lang-row"><Globe size={14} /><span>Language</span></div>
            <div className="lang-pills">
              <button className="lang-pill active">English</button>
              <button className="lang-pill">Yoruba</button>
            </div>
          </div>

          <div className="side-card">
            <h4>Your Activity</h4>
            <div className="activity-stat">
              <TrendingUp size={16} />
              <div><strong>142</strong><span>Corridors compared</span></div>
            </div>
            <div className="activity-stat">
              <Bookmark size={16} />
              <div><strong>4</strong><span>Saved corridors</span></div>
            </div>
            <div className="activity-stat">
              <Bell size={16} />
              <div><strong>3</strong><span>Active alerts</span></div>
            </div>
          </div>

          <div className="side-card">
            <h4>Security</h4>
            <div className="sec-row">
              <Shield size={16} />
              <div><label>Password</label><p>Changed 3 months ago</p></div>
              <button className="btn-link">Change</button>
            </div>
            <div className="sec-row">
              <Shield size={16} />
              <div><label>Two-factor auth</label><p>Not enabled</p></div>
              <button className="btn-link">Enable</button>
            </div>
          </div>
        </aside>
      </div>

      {/* EDIT MODAL */}
      {editing && (
        <div className="modal-backdrop" onClick={cancelEdit}>
          <div className="modal-card edit-profile-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={cancelEdit}><X size={18} /></button>
            <h2>Edit Profile</h2>
            <p>Update your personal information.</p>

            <div className="edit-grid">
              <div className="edit-field">
                <label>Full name</label>
                <input value={draft.name} onChange={(e) => update('name', e.target.value)} />
              </div>
              <div className="edit-field">
                <label>Pronouns</label>
                <input value={draft.pronouns} onChange={(e) => update('pronouns', e.target.value)} />
              </div>
              <div className="edit-field full">
                <label>Role</label>
                <input value={draft.role} onChange={(e) => update('role', e.target.value)} />
              </div>
              <div className="edit-field full">
                <label>Email</label>
                <input type="email" value={draft.email} onChange={(e) => update('email', e.target.value)} />
              </div>
              <div className="edit-field">
                <label>Phone</label>
                <input value={draft.phone} onChange={(e) => update('phone', e.target.value)} />
              </div>
              <div className="edit-field">
                <label>Location</label>
                <input value={draft.location} onChange={(e) => update('location', e.target.value)} />
              </div>
              <div className="edit-field full">
                <label>Handle (public URL)</label>
                <input value={draft.handle} onChange={(e) => update('handle', e.target.value)} />
              </div>
              <div className="edit-field full">
                <label>Bio</label>
                <textarea rows="3" value={draft.bio} onChange={(e) => update('bio', e.target.value)} />
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-outline-modal" onClick={cancelEdit}>Cancel</button>
              <button className="btn-primary-modal" onClick={saveEdit}><Save size={14} /> Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}