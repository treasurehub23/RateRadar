import axios from 'axios'
import { CORRIDORS } from '../constants'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// ---- MOCK DATA (fallback so demo never breaks) ----
export const MOCK_COMPARISON = {
  corridor: 'UK-NG',
  amount: 1000,
  currency: 'GBP',
  updatedAt: new Date().toISOString(),
  routes: [
    {
      provider: 'Binance P2P',
      method: 'P2P (Merchant)',
      rate: 1680,
      feePercent: -0.5,
      feeFlat: 500,
      feeCurrency: 'NGN',
      received: 1680000,
      totalCost: 1688000,
      reliability: 'medium',
      bestRate: true,
      // merchant detail only exists on P2P rows — this is what the "View" modal reads from
      merchant: {
        completionRate: 68,
        avgReleaseTime: '7 min',
        totalTrades: 1248,
        reviewScore: 4.2,
        reviewCount: 312,
        advice: 'This merchant has a medium reliability score. Consider Wise for a safer option, though the rate is slightly lower.',
      },
    },
    {
      provider: 'Lemfi',
      method: 'Transfer',
      rate: 1620,
      feePercent: -1.0,
      feeFlat: 1000,
      feeCurrency: 'NGN',
      received: 1620000,
      totalCost: 1636000,
      reliability: 'high',
    },
    {
      provider: 'Sendwave',
      method: 'Transfer',
      rate: 1590,
      feePercent: -1.5,
      feeFlat: 2000,
      feeCurrency: 'NGN',
      received: 1590000,
      totalCost: 1618000,
      reliability: 'medium',
    },
    {
      provider: 'Wise',
      method: 'Transfer',
      rate: 1580,
      feePercent: -1.2,
      feeFlat: 2500,
      feeCurrency: 'NGN',
      received: 1580000,
      totalCost: 1598500,
      reliability: 'high',
    },
    {
      provider: 'GTBank',
      method: 'Bank Transfer',
      rate: 1520,
      feePercent: -2.5,
      feeFlat: 3000,
      feeCurrency: 'NGN',
      received: 1520000,
      totalCost: 1559000,
      reliability: 'high',
    },
  ],
}

export const MOCK_ALERTS = [
  {
    id: 1,
    type: 'rate-spread',
    severity: 'high',
    title: 'High Rate Spread Detected',
    body: 'The difference between the best and worst rate for UK → NG is 8.4% (usually < 5%).',
    time: 'Today, 10:24 AM',
  },
  {
    id: 2,
    type: 'reliability',
    severity: 'medium',
    title: 'Binance P2P Merchant Reliability Dropped',
    body: "The top merchant's reliability score fell from 92% to 68%.",
    time: 'Yesterday, 4:12 PM',
  },
  {
    id: 3,
    type: 'fee-change',
    severity: 'info',
    title: 'New Fee Structure Detected',
    body: 'Lemfi increased transfer fees from 1.0% to 1.5%.',
    time: 'Aug 28, 2025',
  },
  {
    id: 4,
    type: 'better-rate',
    severity: 'success',
    title: 'Better Rate Available',
    body: 'Wise is now 2.3% better than the bank for UK → NG.',
    time: 'Aug 27, 2025',
  },
]

export const MOCK_TREND = [
  { day: 'Aug 21', rate: 1520 },
  { day: 'Aug 22', rate: 1540 },
  { day: 'Aug 23', rate: 1560 },
  { day: 'Aug 24', rate: 1610 },
  { day: 'Aug 25', rate: 1600 },
  { day: 'Aug 26', rate: 1640 },
  { day: 'Aug 27', rate: 1680 },
]

// ---- API CALLS (fall back to mock if backend down) ----
export const getComparison = async (corridor, amount) => {
  try {
    const res = await axios.get(`${API}/compare`, { params: { corridor, amount }, timeout: 4000 })
    return res.data
  } catch {
    return MOCK_COMPARISON
  }
}

export const getAlerts = async () => {
  try {
    const res = await axios.get(`${API}/alerts`, { timeout: 4000 })
    return res.data
  } catch {
    return MOCK_ALERTS
  }
}

// live summary for all 4 corridors at once — backend endpoint per the team breakdown doc,
// falls back to the static popularAmount on each corridor if the backend isn't up yet
export const getPopularCorridors = async () => {
  try {
    const res = await axios.get(`${API}/corridors/popular`, { timeout: 4000 })
    return res.data
  } catch {
    return CORRIDORS
  }
}

export const getTrend = async () => MOCK_TREND

// ---- "My Corridors" — frontend-only, no backend involved (see team breakdown doc) ----
const SAVED_KEY = 'rateradar_saved_corridors'

const defaultSaved = () => CORRIDORS.map((c, i) => ({
  id: c.value,
  fromFlag: c.fromFlag, toFlag: c.toFlag,
  label: `${c.fromLabel.split(' (')[0]} → ${c.toLabel.split(' (')[0]}`,
  fromCode: c.fromCode, toCode: c.toCode,
  lastUsed: '—',
  default: i === 0,
}))

export const getSavedCorridors = () => {
  try {
    const raw = localStorage.getItem(SAVED_KEY)
    if (!raw) {
      const seeded = defaultSaved()
      localStorage.setItem(SAVED_KEY, JSON.stringify(seeded))
      return seeded
    }
    return JSON.parse(raw)
  } catch {
    return defaultSaved() // storage blocked or corrupted — still show something instead of an empty page
  }
}

export const addSavedCorridor = (corridorValue) => {
  try {
    const existing = getSavedCorridors()
    if (existing.some((c) => c.id === corridorValue)) return existing
    const c = CORRIDORS.find((x) => x.value === corridorValue)
    if (!c) return existing
    const updated = [...existing, {
      id: c.value, fromFlag: c.fromFlag, toFlag: c.toFlag,
      label: `${c.fromLabel.split(' (')[0]} → ${c.toLabel.split(' (')[0]}`,
      fromCode: c.fromCode, toCode: c.toCode, lastUsed: 'Just now', default: false,
    }]
    localStorage.setItem(SAVED_KEY, JSON.stringify(updated))
    return updated
  } catch {
    return getSavedCorridors()
  }
}

export const removeSavedCorridor = (id) => {
  try {
    const updated = getSavedCorridors().filter((c) => c.id !== id)
    localStorage.setItem(SAVED_KEY, JSON.stringify(updated))
    return updated
  } catch {
    return getSavedCorridors()
  }
}