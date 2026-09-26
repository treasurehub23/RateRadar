// Every currency appears once — pick the most recognizable name for it
export const COUNTRIES = [
  // Major sending countries
  { iso: 'gb', name: 'United Kingdom',  currency: 'GBP', symbol: '£' },
  { iso: 'us', name: 'United States',   currency: 'USD', symbol: '$' },
  { iso: 'ca', name: 'Canada',          currency: 'CAD', symbol: 'C$' },
  { iso: 'au', name: 'Australia',       currency: 'AUD', symbol: 'A$' },
  { iso: 'nz', name: 'New Zealand',     currency: 'NZD', symbol: 'NZ$' },
  { iso: 'eu', name: 'European Union',  currency: 'EUR', symbol: '€' },
  { iso: 'ch', name: 'Switzerland',     currency: 'CHF', symbol: 'Fr' },
  { iso: 'se', name: 'Sweden',          currency: 'SEK', symbol: 'kr' },
  { iso: 'no', name: 'Norway',          currency: 'NOK', symbol: 'kr' },
  { iso: 'dk', name: 'Denmark',         currency: 'DKK', symbol: 'kr' },
  { iso: 'jp', name: 'Japan',           currency: 'JPY', symbol: '¥' },
  { iso: 'cn', name: 'China',           currency: 'CNY', symbol: '¥' },
  { iso: 'in', name: 'India',           currency: 'INR', symbol: '₹' },
  { iso: 'sg', name: 'Singapore',       currency: 'SGD', symbol: 'S$' },
  { iso: 'hk', name: 'Hong Kong',       currency: 'HKD', symbol: 'HK$' },
  { iso: 'kr', name: 'South Korea',     currency: 'KRW', symbol: '₩' },
  { iso: 'my', name: 'Malaysia',        currency: 'MYR', symbol: 'RM' },
  { iso: 'th', name: 'Thailand',        currency: 'THB', symbol: '฿' },
  { iso: 'ph', name: 'Philippines',     currency: 'PHP', symbol: '₱' },
  { iso: 'id', name: 'Indonesia',       currency: 'IDR', symbol: 'Rp' },
  { iso: 'pk', name: 'Pakistan',        currency: 'PKR', symbol: '₨' },
  { iso: 'bd', name: 'Bangladesh',      currency: 'BDT', symbol: '৳' },
  { iso: 'ae', name: 'UAE',             currency: 'AED', symbol: 'د.إ' },
  { iso: 'sa', name: 'Saudi Arabia',    currency: 'SAR', symbol: '﷼' },
  { iso: 'qa', name: 'Qatar',           currency: 'QAR', symbol: '﷼' },
  { iso: 'kw', name: 'Kuwait',          currency: 'KWD', symbol: 'د.ك' },
  { iso: 'bh', name: 'Bahrain',         currency: 'BHD', symbol: '.د.ب' },
  { iso: 'om', name: 'Oman',            currency: 'OMR', symbol: '﷼' },
  { iso: 'br', name: 'Brazil',          currency: 'BRL', symbol: 'R$' },
  { iso: 'mx', name: 'Mexico',          currency: 'MXN', symbol: '$' },
  { iso: 'ar', name: 'Argentina',       currency: 'ARS', symbol: '$' },

  // African receiving countries
  { iso: 'ng', name: 'Nigeria',         currency: 'NGN', symbol: '₦' },
  { iso: 'gh', name: 'Ghana',           currency: 'GHS', symbol: 'GH₵' },
  { iso: 'ke', name: 'Kenya',           currency: 'KES', symbol: 'KSh' },
  { iso: 'za', name: 'South Africa',    currency: 'ZAR', symbol: 'R' },
  { iso: 'ug', name: 'Uganda',          currency: 'UGX', symbol: 'USh' },
  { iso: 'tz', name: 'Tanzania',        currency: 'TZS', symbol: 'TSh' },
  { iso: 'rw', name: 'Rwanda',          currency: 'RWF', symbol: 'FRw' },
  { iso: 'et', name: 'Ethiopia',        currency: 'ETB', symbol: 'Br' },
  { iso: 'eg', name: 'Egypt',           currency: 'EGP', symbol: 'E£' },
  { iso: 'ma', name: 'Morocco',         currency: 'MAD', symbol: 'د.م.' },
  { iso: 'zm', name: 'Zambia',          currency: 'ZMW', symbol: 'ZK' },
  { iso: 'zw', name: 'Zimbabwe',        currency: 'ZWL', symbol: 'Z$' },
  { iso: 'bw', name: 'Botswana',        currency: 'BWP', symbol: 'P' },
  { iso: 'na', name: 'Namibia',         currency: 'NAD', symbol: 'N$' },
  { iso: 'mw', name: 'Malawi',          currency: 'MWK', symbol: 'MK' },
  { iso: 'mz', name: 'Mozambique',      currency: 'MZN', symbol: 'MT' },
  { iso: 'ao', name: 'Angola',          currency: 'AOA', symbol: 'Kz' },
  { iso: 'cm', name: 'Cameroon',        currency: 'XAF', symbol: 'FCFA' },
  { iso: 'sn', name: 'Senegal',         currency: 'XOF', symbol: 'CFA' },
  { iso: 'ci', name: 'Ivory Coast',     currency: 'XOF', symbol: 'CFA' },
]

export const getCountryByCurrency = (code) =>
  COUNTRIES.find((c) => c.currency === code) || COUNTRIES[0]

export const FLAG_ISO = COUNTRIES.reduce((acc, c) => {
  acc[c.currency] = c.iso
  return acc
}, {})

// Kept for backwards compatibility — pick a few default "popular" pairs
export const CORRIDORS = [
  { value: 'GBP-NGN', fromCode: 'GBP', toCode: 'NGN', fromLabel: 'United Kingdom (GBP)', toLabel: 'Nigeria (NGN)', currency: '£', popularAmount: '₦1,740,000' },
  { value: 'USD-NGN', fromCode: 'USD', toCode: 'NGN', fromLabel: 'United States (USD)', toLabel: 'Nigeria (NGN)', currency: '$', popularAmount: '₦1,580,000' },
  { value: 'USD-GHS', fromCode: 'USD', toCode: 'GHS', fromLabel: 'United States (USD)', toLabel: 'Ghana (GHS)', currency: '$', popularAmount: 'GH₵ 16,200' },
  { value: 'CAD-KES', fromCode: 'CAD', toCode: 'KES', fromLabel: 'Canada (CAD)', toLabel: 'Kenya (KES)', currency: 'C$', popularAmount: 'KSh 98,000' },
  { value: 'EUR-NGN', fromCode: 'EUR', toCode: 'NGN', fromLabel: 'European Union (EUR)', toLabel: 'Nigeria (NGN)', currency: '€', popularAmount: '₦1,760,000' },
  { value: 'GBP-KES', fromCode: 'GBP', toCode: 'KES', fromLabel: 'United Kingdom (GBP)', toLabel: 'Kenya (KES)', currency: '£', popularAmount: 'KSh 165,000' },
  { value: 'AED-NGN', fromCode: 'AED', toCode: 'NGN', fromLabel: 'UAE (AED)', toLabel: 'Nigeria (NGN)', currency: 'د.إ', popularAmount: '₦452,000' },
  { value: 'AUD-NGN', fromCode: 'AUD', toCode: 'NGN', fromLabel: 'Australia (AUD)', toLabel: 'Nigeria (NGN)', currency: 'A$', popularAmount: '₦1,030,000' },
  { value: 'GBP-GHS', fromCode: 'GBP', toCode: 'GHS', fromLabel: 'United Kingdom (GBP)', toLabel: 'Ghana (GHS)', currency: '£', popularAmount: 'GH₵ 18,200' },
  { value: 'USD-KES', fromCode: 'USD', toCode: 'KES', fromLabel: 'United States (USD)', toLabel: 'Kenya (KES)', currency: '$', popularAmount: 'KSh 128,500' },
  { value: 'USD-ZAR', fromCode: 'USD', toCode: 'ZAR', fromLabel: 'United States (USD)', toLabel: 'South Africa (ZAR)', currency: '$', popularAmount: 'R 18,400' },
  { value: 'GBP-ZAR', fromCode: 'GBP', toCode: 'ZAR', fromLabel: 'United Kingdom (GBP)', toLabel: 'South Africa (ZAR)', currency: '£', popularAmount: 'R 23,600' },
]

export const getCorridor = (value) =>
  CORRIDORS.find((c) => c.value === value) || CORRIDORS[0]