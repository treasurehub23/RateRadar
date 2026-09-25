export const CORRIDORS = [
  { value: 'UK-NG',    fromFlag: '🇬🇧', toFlag: '🇳🇬', fromLabel: 'United Kingdom (GBP)', toLabel: 'Nigeria (NGN)',    fromCode: 'GBP', toCode: 'NGN', currency: '£',  popularAmount: '₦1,680,000' },
  { value: 'CAD-KE',   fromFlag: '🇨🇦', toFlag: '🇰🇪', fromLabel: 'Canada (CAD)',         toLabel: 'Kenya (KES)',      fromCode: 'CAD', toCode: 'KES', currency: 'C$', popularAmount: 'KSh 91,200' },
  { value: 'USA-GH',   fromFlag: '🇺🇸', toFlag: '🇬🇭', fromLabel: 'USA (USD)',            toLabel: 'Ghana (GHS)',      fromCode: 'USD', toCode: 'GHS', currency: '$',  popularAmount: 'GH₵ 14,900' },
  { value: 'EU-NG',    fromFlag: '🇪🇺', toFlag: '🇳🇬', fromLabel: 'EU (EUR)',             toLabel: 'Nigeria (NGN)',    fromCode: 'EUR', toCode: 'NGN', currency: '€',  popularAmount: '₦1,645,000' },
  { value: 'USA-NG',   fromFlag: '🇺🇸', toFlag: '🇳🇬', fromLabel: 'USA (USD)',            toLabel: 'Nigeria (NGN)',    fromCode: 'USD', toCode: 'NGN', currency: '$',  popularAmount: '₦1,580,000' },
  { value: 'USA-KE',   fromFlag: '🇺🇸', toFlag: '🇰🇪', fromLabel: 'USA (USD)',            toLabel: 'Kenya (KES)',      fromCode: 'USD', toCode: 'KES', currency: '$',  popularAmount: 'KSh 128,500' },
  { value: 'USA-ZA',   fromFlag: '🇺🇸', toFlag: '🇿🇦', fromLabel: 'USA (USD)',            toLabel: 'South Africa (ZAR)', fromCode: 'USD', toCode: 'ZAR', currency: '$', popularAmount: 'R 18,400' },
  { value: 'UK-KE',    fromFlag: '🇬🇧', toFlag: '🇰🇪', fromLabel: 'United Kingdom (GBP)', toLabel: 'Kenya (KES)',      fromCode: 'GBP', toCode: 'KES', currency: '£',  popularAmount: 'KSh 165,000' },
  { value: 'UK-GH',    fromFlag: '🇬🇧', toFlag: '🇬🇭', fromLabel: 'United Kingdom (GBP)', toLabel: 'Ghana (GHS)',      fromCode: 'GBP', toCode: 'GHS', currency: '£',  popularAmount: 'GH₵ 18,200' },
  { value: 'UK-ZA',    fromFlag: '🇬🇧', toFlag: '🇿🇦', fromLabel: 'United Kingdom (GBP)', toLabel: 'South Africa (ZAR)', fromCode: 'GBP', toCode: 'ZAR', currency: '£', popularAmount: 'R 23,600' },
  { value: 'CAD-NG',   fromFlag: '🇨🇦', toFlag: '🇳🇬', fromLabel: 'Canada (CAD)',         toLabel: 'Nigeria (NGN)',    fromCode: 'CAD', toCode: 'NGN', currency: 'C$', popularAmount: '₦1,720,000' },
  { value: 'CAD-GH',   fromFlag: '🇨🇦', toFlag: '🇬🇭', fromLabel: 'Canada (CAD)',         toLabel: 'Ghana (GHS)',      fromCode: 'CAD', toCode: 'GHS', currency: 'C$', popularAmount: 'GH₵ 11,200' },
  { value: 'EU-KE',    fromFlag: '🇪🇺', toFlag: '🇰🇪', fromLabel: 'EU (EUR)',             toLabel: 'Kenya (KES)',      fromCode: 'EUR', toCode: 'KES', currency: '€',  popularAmount: 'KSh 142,000' },
  { value: 'EU-GH',    fromFlag: '🇪🇺', toFlag: '🇬🇭', fromLabel: 'EU (EUR)',             toLabel: 'Ghana (GHS)',      fromCode: 'EUR', toCode: 'GHS', currency: '€',  popularAmount: 'GH₵ 15,600' },
  { value: 'AUS-NG',   fromFlag: '🇦🇺', toFlag: '🇳🇬', fromLabel: 'Australia (AUD)',      toLabel: 'Nigeria (NGN)',    fromCode: 'AUD', toCode: 'NGN', currency: 'A$', popularAmount: '₦1,030,000' },
  { value: 'AUS-KE',   fromFlag: '🇦🇺', toFlag: '🇰🇪', fromLabel: 'Australia (AUD)',      toLabel: 'Kenya (KES)',      fromCode: 'AUD', toCode: 'KES', currency: 'A$', popularAmount: 'KSh 85,400' },
  { value: 'UAE-NG',   fromFlag: '🇦🇪', toFlag: '🇳🇬', fromLabel: 'UAE (AED)',            toLabel: 'Nigeria (NGN)',    fromCode: 'AED', toCode: 'NGN', currency: 'د.إ', popularAmount: '₦452,000' },
  { value: 'UAE-KE',   fromFlag: '🇦🇪', toFlag: '🇰🇪', fromLabel: 'UAE (AED)',            toLabel: 'Kenya (KES)',      fromCode: 'AED', toCode: 'KES', currency: 'د.إ', popularAmount: 'KSh 35,800' },
]

export const FLAG_ISO = {
  GBP: 'gb', USD: 'us', CAD: 'ca', EUR: 'eu', AUD: 'au', AED: 'ae',
  KES: 'ke', NGN: 'ng', GHS: 'gh', ZAR: 'za',
}

export const getCorridor = (value) => CORRIDORS.find((c) => c.value === value) || CORRIDORS[0]