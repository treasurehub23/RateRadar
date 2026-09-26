import axios from 'axios'
import { CORRIDORS, getCountryByCurrency } from '../constants'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// ---------- USD-based reference rates (1 USD = X) ----------
// Used for cross-conversion between ANY pair of currencies.
const USD_RATES = {
  USD: 1, GBP: 0.79, EUR: 0.92, CAD: 1.36, AUD: 1.52, NZD: 1.64,
  CHF: 0.88, SEK: 10.5, NOK: 10.7, DKK: 6.85,
  JPY: 150, CNY: 7.2, INR: 83, SGD: 1.34, HKD: 7.82, KRW: 1340,
  MYR: 4.7, THB: 36, PHP: 57, IDR: 15800, PKR: 278, BDT: 118,
  AED: 3.67, SAR: 3.75, QAR: 3.64, KWD: 0.31, BHD: 0.38, OMR: 0.385,
  BRL: 5.5, MXN: 17.5, ARS: 900,
  NGN: 1580, GHS: 15.3, KES: 128.5, ZAR: 18.4,
  UGX: 3800, TZS: 2650, RWF: 1300, ETB: 57, EGP: 48, MAD: 10,
  ZMW: 27, ZWL: 13, BWP: 13.6, NAD: 18.4, MWK: 1740, MZN: 63, AOA: 830,
  XAF: 605, XOF: 605,
}

// ---------- PROVIDERS that appear on every corridor ----------
const PROVIDERS = [
  { provider: 'Bybit P2P', method: 'P2P (Merchant)', mult: 1.00, feePercent: -0.5, feeFlatBase: 500, reliability: 'medium' },
  { provider: 'Lemfi',     method: 'Transfer',       mult: 0.97, feePercent: -1.0, feeFlatBase: 1000, reliability: 'high' },
  { provider: 'Sendwave',  method: 'Transfer',       mult: 0.95, feePercent: -1.5, feeFlatBase: 2000, reliability: 'medium' },
  { provider: 'Wise',      method: 'Transfer',       mult: 0.94, feePercent: -1.2, feeFlatBase: 2500, reliability: 'high' },
  { provider: 'GTBank',    method: 'Bank Transfer',  mult: 0.88, feePercent: -2.5, feeFlatBase: 3000, reliability: 'high' },
]

// ---------- Hardcoded polished rates for popular corridors ----------
const HARDCODED = {
  'GBP-NGN': 1740, 'USD-NGN': 1580, 'EUR-NGN': 1760,
  'CAD-NGN': 1720, 'AUD-NGN': 1030, 'AED-NGN': 452,
  'USD-GHS': 16.2, 'GBP-GHS': 18.2, 'EUR-GHS': 15.6, 'CAD-GHS': 11.2,
  'USD-KES': 128.5, 'GBP-KES': 165, 'EUR-KES': 142, 'CAD-KES': 98, 'AUD-KES': 85.4, 'AED-KES': 35.8,
  'USD-ZAR': 18.4, 'GBP-ZAR': 23.6, 'EUR-ZAR': 20.0,
}

const MERCHANT_META = {
  completionRate: 68,
  avgReleaseTime: '7 min',
  totalTrades: 1248,
  reviewScore: 4.2,
  reviewCount: 312,
  advice: 'This merchant has a medium reliability score. Consider Wise for a safer option, though the rate is slightly lower.',
}

function getBaseRate(fromCode, toCode) {
  const key = `${fromCode}-${toCode}`
  if (HARDCODED[key]) return HARDCODED[key]
  const fromRate = USD_RATES[fromCode] || 1
  const toRate = USD_RATES[toCode] || 1
  return toRate / fromRate
}

function buildMockComparison(corridor, amount) {
  const [fromCode, toCode] = corridor.split('-')

  const fromCountry = getCountryByCurrency(fromCode)
  const toCountry = getCountryByCurrency(toCode)

  const baseRate = getBaseRate(fromCode, toCode)
  const scale = amount / 1000

  const routes = PROVIDERS.map((p) => {
    const rate = +(baseRate * p.mult).toFixed(4)
    const received = Math.round(rate * amount)
    const feeFlat = Math.round(p.feeFlatBase * scale)
    const totalCost = Math.round(received + Math.abs(feeFlat))
    return {
      provider: p.provider,
      method: p.method,
      rate,
      feePercent: p.feePercent,
      feeFlat,
      feeCurrency: toCode,
      received,
      totalCost,
      reliability: p.reliability,
      bestRate: false,
      ...(p.provider === 'Bybit P2P' ? { merchant: MERCHANT_META } : {}),
    }
  })

  routes.sort((a, b) => b.received - a.received)
  if (routes[0]) routes[0].bestRate = true

  return {
    corridor,
    amount,
    currency: fromCode,
    toCode,
    symbol: toCountry.symbol,
    fromName: fromCountry.name,
    toName: toCountry.name,
    updatedAt: new Date().toISOString(),
    routes,
  }
}

export const MOCK_COMPARISON = buildMockComparison('GBP-NGN', 1000)

export const MOCK_ALERTS = [
  { id: 1,  type: 'rate-spread', severity: 'high',    title: 'High Rate Spread Detected',              body: 'The difference between the best and worst rate is above 10% on several corridors.',          time: 'Today, 10:24 AM' },
  { id: 2,  type: 'reliability', severity: 'medium',  title: 'Bybit P2P Merchant Reliability Dropped',  body: "The top merchant's reliability score fell from 92% to 68%.",                                  time: 'Yesterday, 4:12 PM' },
  { id: 3,  type: 'fee-change',  severity: 'info',    title: 'New Fee Structure Detected',              body: 'Lemfi increased transfer fees from 1.0% to 1.5%.',                                            time: 'Sep 23, 2026' },
  { id: 4,  type: 'rate-spread', severity: 'success', title: 'Better Rate Available',                   body: 'Wise is now 2.3% better than the bank for UK → NG.',                                          time: 'Sep 22, 2026' },
  { id: 5,  type: 'rate-spread', severity: 'high',    title: 'Parallel Market Spread Widened',          body: 'Official vs parallel rate gap for USD → NGN crossed 18% today.',                              time: 'Sep 21, 2026' },
  { id: 6,  type: 'reliability', severity: 'medium',  title: 'New High-Reliability Merchant Detected',  body: 'A Bybit P2P merchant with 98% completion rate is now offering ₦1,720/$.',                     time: 'Sep 20, 2026' },
  { id: 7,  type: 'fee-change',  severity: 'info',    title: 'Sendwave Fee Update',                     body: 'Sendwave reduced its flat fee from $2.50 to $1.99 for UK → NG transfers.',                    time: 'Sep 19, 2026' },
  { id: 8,  type: 'reliability', severity: 'high',    title: 'Suspicious Merchant Activity',            body: 'A merchant on Bybit P2P with 12 trades and 41% completion rate is offering above-market rates.', time: 'Sep 19, 2026' },
  { id: 9,  type: 'rate-spread', severity: 'success', title: 'Stable Week for GBP → NGN',               body: 'Rate has moved less than 1.2% over the last 7 days. Good time to send.',                      time: 'Sep 18, 2026' },
  { id: 10, type: 'fee-change',  severity: 'medium',  title: 'Hidden FX Markup Detected',               body: 'Two providers are inflating rates by 0.8%–1.4% instead of showing fees upfront.',            time: 'Sep 17, 2026' },
]

export const MOCK_TREND = [
  { day: 'Aug 21', rate: 1630 },
  { day: 'Aug 22', rate: 1655 },
  { day: 'Aug 23', rate: 1670 },
  { day: 'Aug 24', rate: 1700 },
  { day: 'Aug 25', rate: 1715 },
  { day: 'Aug 26', rate: 1728 },
  { day: 'Aug 27', rate: 1740 },
]

export const MOCK_CORRIDORS = [
  { id: 1, fromCode: 'GBP', toCode: 'NGN', fromLabel: 'United Kingdom (GBP)', toLabel: 'Nigeria (NGN)', lastUsed: 'Aug 28, 2025', default: true },
  { id: 2, fromCode: 'CAD', toCode: 'KES', fromLabel: 'Canada (CAD)', toLabel: 'Kenya (KES)', lastUsed: 'Aug 26, 2025' },
  { id: 3, fromCode: 'USD', toCode: 'GHS', fromLabel: 'USA (USD)', toLabel: 'Ghana (GHS)', lastUsed: 'Aug 24, 2025' },
  { id: 4, fromCode: 'EUR', toCode: 'NGN', fromLabel: 'EU (EUR)', toLabel: 'Nigeria (NGN)', lastUsed: 'Aug 20, 2025' },
]

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
  fromCode: c.fromCode,
  toCode: c.toCode,
  label: `${c.fromLabel.split(' (')[0]} → ${c.toLabel.split(' (')[0]}`,
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
      fromCode: c.fromCode,
      toCode: c.toCode,
      label: `${c.fromLabel.split(' (')[0]} → ${c.toLabel.split(' (')[0]}`,
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