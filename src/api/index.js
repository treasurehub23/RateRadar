import axios from 'axios'

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

export const MOCK_CORRIDORS = [
  { id: 1, from: 'UK', to: 'NG', fromFlag: '🇬🇧', toFlag: '🇳🇬', fromCode: 'GBP', toCode: 'NGN', label: 'UK → Nigeria', lastUsed: 'Aug 28, 2025', default: true },
  { id: 2, from: 'USA', to: 'NG', fromFlag: '🇺🇸', toFlag: '🇳🇬', fromCode: 'USD', toCode: 'NGN', label: 'USA → Nigeria', lastUsed: 'Aug 26, 2025' },
  { id: 3, from: 'Canada', to: 'NG', fromFlag: '🇨🇦', toFlag: '🇳🇬', fromCode: 'CAD', toCode: 'NGN', label: 'Canada → Nigeria', lastUsed: 'Aug 24, 2025' },
  { id: 4, from: 'EU', to: 'NG', fromFlag: '🇪🇺', toFlag: '🇳🇬', fromCode: 'EUR', toCode: 'NGN', label: 'EU → Nigeria', lastUsed: 'Aug 20, 2025' },
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

export const getCorridors = async () => {
  try {
    const res = await axios.get(`${API}/corridors`, { timeout: 4000 })
    return res.data
  } catch {
    return MOCK_CORRIDORS
  }
}

export const getTrend = async () => MOCK_TREND