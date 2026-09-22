import axios from 'axios'
import { CORRIDORS } from '../constants'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// ---------- BASE RATES PER CORRIDOR (at 1000 sender units) ----------
const BASE_RATES = {
  'UK-NG':  { currency: 'GBP', toCode: 'NGN',  symbol: '₦', routes: [
    { provider: 'Binance P2P', method: 'P2P (Merchant)', rate: 1680, feePercent: -0.5, feeFlat: 500,  reliability: 'medium', bestRate: true },
    { provider: 'Lemfi',       method: 'Transfer',       rate: 1620, feePercent: -1.0, feeFlat: 1000, reliability: 'high' },
    { provider: 'Sendwave',    method: 'Transfer',       rate: 1590, feePercent: -1.5, feeFlat: 2000, reliability: 'medium' },
    { provider: 'Wise',        method: 'Transfer',       rate: 1580, feePercent: -1.2, feeFlat: 2500, reliability: 'high' },
    { provider: 'GTBank',      method: 'Bank Transfer',  rate: 1520, feePercent: -2.5, feeFlat: 3000, reliability: 'high' },
  ]},
  'USA-GH': { currency: 'USD', toCode: 'GHS',  symbol: 'GH₵', routes: [
    { provider: 'Binance P2P', method: 'P2P (Merchant)', rate: 15.6, feePercent: -0.4, feeFlat: 5,  reliability: 'medium', bestRate: true },
    { provider: 'Lemfi',       method: 'Transfer',       rate: 15.1, feePercent: -0.9, feeFlat: 8,  reliability: 'high' },
    { provider: 'Sendwave',    method: 'Transfer',       rate: 14.9, feePercent: -1.4, feeFlat: 12, reliability: 'medium' },
    { provider: 'Wise',        method: 'Transfer',       rate: 14.8, feePercent: -1.1, feeFlat: 10, reliability: 'high' },
    { provider: 'GTBank',      method: 'Bank Transfer',  rate: 14.2, feePercent: -2.3, feeFlat: 20, reliability: 'high' },
  ]},
  'CAD-KE': { currency: 'CAD', toCode: 'KES',  symbol: 'KSh ', routes: [
    { provider: 'Binance P2P', method: 'P2P (Merchant)', rate: 95.5, feePercent: -0.5, feeFlat: 30, reliability: 'medium', bestRate: true },
    { provider: 'Lemfi',       method: 'Transfer',       rate: 92.4, feePercent: -1.0, feeFlat: 50, reliability: 'high' },
    { provider: 'Sendwave',    method: 'Transfer',       rate: 91.0, feePercent: -1.5, feeFlat: 80, reliability: 'medium' },
    { provider: 'Wise',        method: 'Transfer',       rate: 90.2, feePercent: -1.2, feeFlat: 60, reliability: 'high' },
    { provider: 'GTBank',      method: 'Bank Transfer',  rate: 87.0, feePercent: -2.5, feeFlat: 100, reliability: 'high' },
  ]},
  'EU-NG':  { currency: 'EUR', toCode: 'NGN',  symbol: '₦', routes: [
    { provider: 'Binance P2P', method: 'P2P (Merchant)', rate: 1720, feePercent: -0.5, feeFlat: 500,  reliability: 'medium', bestRate: true },
    { provider: 'Lemfi',       method: 'Transfer',       rate: 1680, feePercent: -1.0, feeFlat: 1000, reliability: 'high' },
    { provider: 'Sendwave',    method: 'Transfer',       rate: 1650, feePercent: -1.5, feeFlat: 2000, reliability: 'medium' },
    { provider: 'Wise',        method: 'Transfer',       rate: 1640, feePercent: -1.2, feeFlat: 2500, reliability: 'high' },
    { provider: 'GTBank',      method: 'Bank Transfer',  rate: 1580, feePercent: -2.5, feeFlat: 3000, reliability: 'high' },
  ]},
}

const MERCHANT_META = {
  completionRate: 68,
  avgReleaseTime: '7 min',
  totalTrades: 1248,
  reviewScore: 4.2,
  reviewCount: 312,
  advice: 'This merchant has a medium reliability score. Consider Wise for a safer option, though the rate is slightly lower.',
}

// ---------- BUILD A RESPONSE FOR ANY CORRIDOR + AMOUNT ----------
function buildMockComparison(corridor, amount) {
  const base = BASE_RATES[corridor] || BASE_RATES['UK-NG']
  const scale = amount / 1000

  const routes = base.routes.map((r) => {
    const received = Math.round(r.rate * amount)
    const feeFlat = Math.round(r.feeFlat * scale)
    const totalCost = Math.round(received + Math.abs(feeFlat))
    return {
      provider: r.provider,
      method: r.method,
      rate: r.rate,
      feePercent: r.feePercent,
      feeFlat,
      feeCurrency: base.toCode,
      received,
      totalCost,
      reliability: r.reliability,
      bestRate: r.bestRate || false,
      ...(r.provider === 'Binance P2P' ? { merchant: MERCHANT_META } : {}),
    }
  })

  return {
    corridor,
    amount,
    currency: base.currency,
    toCode: base.toCode,
    symbol: base.symbol,
    updatedAt: new Date().toISOString(),
    routes,
  }
}

// ---------- MOCK CONSTANTS (fallback data) ----------
export const MOCK_COMPARISON = buildMockComparison('UK-NG', 1000)

export const MOCK_ALERTS = [
  { id: 1, type: 'rate-spread', severity: 'high', title: 'High Rate Spread Detected', body: 'The difference between the best and worst rate for UK → NG is 8.4% (usually < 5%).', time: 'Today, 10:24 AM' },
  { id: 2, type: 'reliability', severity: 'medium', title: 'Binance P2P Merchant Reliability Dropped', body: "The top merchant's reliability score fell from 92% to 68%.", time: 'Yesterday, 4:12 PM' },
  { id: 3, type: 'fee-change', severity: 'info', title: 'New Fee Structure Detected', body: 'Lemfi increased transfer fees from 1.0% to 1.5%.', time: 'Aug 28, 2025' },
  { id: 4, type: 'rate-spread', severity: 'success', title: 'Better Rate Available', body: 'Wise is now 2.3% better than the bank for UK → NG.', time: 'Aug 27, 2025' },
  { id: 5, type: 'rate-spread', severity: 'high', title: 'Parallel Market Spread Widened', body: 'Official vs parallel rate gap for USD → NGN crossed 18% today.', time: 'Aug 27, 2025' },
  { id: 6, type: 'reliability', severity: 'medium', title: 'New High-Reliability Merchant Detected', body: 'A Bybit P2P merchant with 98% completion rate is now offering ₦1,675/$.', time: 'Aug 26, 2025' },
  { id: 7, type: 'fee-change', severity: 'info', title: 'Sendwave Fee Update', body: 'Sendwave reduced its flat fee from $2.50 to $1.99 for UK → NG transfers.', time: 'Aug 26, 2025' },
  { id: 8, type: 'reliability', severity: 'high', title: 'Suspicious Merchant Activity', body: 'A merchant on Binance P2P with 12 trades and 41% completion rate is offering above-market rates. Approach with caution.', time: 'Aug 25, 2025' },
  { id: 9, type: 'rate-spread', severity: 'success', title: 'Stable Week for GBP → NGN', body: 'Rate has moved less than 1.2% over the last 7 days. Good time to send.', time: 'Aug 25, 2025' },
  { id: 10, type: 'fee-change', severity: 'medium', title: 'Hidden FX Markup Detected', body: 'Two providers are inflating rates by 0.8%–1.4% instead of showing fees upfront.', time: 'Aug 24, 2025' },
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

export const MOCK_CORRIDORS = [
  { id: 1, fromCode: 'GBP', toCode: 'NGN', fromLabel: 'United Kingdom (GBP)', toLabel: 'Nigeria (NGN)', lastUsed: 'Aug 28, 2025', default: true },
  { id: 2, fromCode: 'CAD', toCode: 'KES', fromLabel: 'Canada (CAD)', toLabel: 'Kenya (KES)', lastUsed: 'Aug 26, 2025' },
  { id: 3, fromCode: 'USD', toCode: 'GHS', fromLabel: 'USA (USD)', toLabel: 'Ghana (GHS)', lastUsed: 'Aug 24, 2025' },
  { id: 4, fromCode: 'EUR', toCode: 'NGN', fromLabel: 'EU (EUR)', toLabel: 'Nigeria (NGN)', lastUsed: 'Aug 20, 2025' },
]

// ---------- API CALLS ----------
export const getComparison = async (corridor, amount) => {
  try {
    const res = await axios.get(`${API}/compare`, { params: { corridor, amount }, timeout: 4000 })
    return res.data
  } catch {
    return buildMockComparison(corridor, amount)
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

export const getCorridors = async () => {
  try {
    const res = await axios.get(`${API}/corridors`, { timeout: 4000 })
    return res.data
  } catch {
    return MOCK_CORRIDORS
  }
}

export const getPopularCorridors = async () => {
  try {
    const res = await axios.get(`${API}/corridors/popular`, { timeout: 4000 })
    return res.data
  } catch {
    return CORRIDORS
  }
}

export const getTrend = async () => MOCK_TREND

// ---------- "My Corridors" — localStorage only ----------
const SAVED_KEY = 'rateradar_saved_corridors'

const defaultSaved = () => CORRIDORS.map((c, i) => ({
  id: c.value,
  fromFlag: c.fromFlag,
  toFlag: c.toFlag,
  label: `${c.fromLabel.split(' (')[0]} → ${c.toLabel.split(' (')[0]}`,
  fromCode: c.fromCode,
  toCode: c.toCode,
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
    return defaultSaved()
  }
}

export const addSavedCorridor = (corridorValue) => {
  try {
    const existing = getSavedCorridors()
    if (existing.some((c) => c.id === corridorValue)) return existing
    const c = CORRIDORS.find((x) => x.value === corridorValue)
    if (!c) return existing
    const updated = [...existing, {
      id: c.value,
      fromFlag: c.fromFlag,
      toFlag: c.toFlag,
      label: `${c.fromLabel.split(' (')[0]} → ${c.toLabel.split(' (')[0]}`,
      fromCode: c.fromCode,
      toCode: c.toCode,
      lastUsed: 'Just now',
      default: false,
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