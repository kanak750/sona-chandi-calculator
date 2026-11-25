/**
 * calculations.js - Metal rate calculations: Gold (10g base) and Silver (1kg base)
 */

export const GOLD_PURITIES = [
  { id: '22k', label: '22K (91.6% Hallmark 916 - Standard)', factor: 22 / 24, percent: 91.6 },
  { id: '24k', label: '24K (99.9% Pure Bullion)', factor: 1.0, percent: 100 },
  { id: '85', label: '85% (850 Hallmark / 20.4K)', factor: 0.85, percent: 85.0 },
  { id: '18k', label: '18K (75.0% Jewellery)', factor: 18 / 24, percent: 75.0 },
  { id: '14k', label: '14K (58.5% Modern Fashion)', factor: 14 / 24, percent: 58.5 },
  { id: 'direct', label: 'Direct Rate (No purity deduction)', factor: 1.0, percent: 100 },
  { id: 'custom', label: 'Custom Percentage (%)', factor: null, percent: null }
];

export const SILVER_PURITIES = [
  { id: '999', label: '999 Fine Silver (99.9% Bullion)', factor: 1.0, percent: 99.9 },
  { id: '925', label: '925 Sterling Silver (92.5% Ornaments)', factor: 0.925, percent: 92.5 },
  { id: '900', label: '900 Traditional Silver (90.0%)', factor: 0.900, percent: 90.0 },
  { id: '800', label: '800 Utensil Grade (80.0%)', factor: 0.800, percent: 80.0 },
  { id: 'direct', label: 'Direct Rate (No purity deduction)', factor: 1.0, percent: 100 },
  { id: 'custom', label: 'Custom Percentage (%)', factor: null, percent: null }
];

export const ITEM_TYPES = {
  gold: [
    'Ring', 'Chain', 'Necklace', 'Earrings', 'Bangles',
    'Bracelet', 'Gold Coin', 'Gold Bar', 'Pendant',
    'Mangalsutra', 'Nose Pin', 'Kada', 'Custom / Enter Manually'
  ],
  silver: [
    'Silver Coin', 'Silver Bar', 'Payal / Anklet',
    'Pooja Thali / Item', 'Murti / Idol', 'Utensil / Glass',
    'Ring', 'Chain', 'Bracelet', 'Toe Ring / Bichiya', 'Custom / Enter Manually'
  ]
};

/**
 * Gold calculation based on 10g rate input
 */
export function calculateGold({
  rate10g,
  weight,
  purityId = '22k',
  customPurityPercent = null,
  labourType = 'flat',
  labourValue = 0,
  includeGst = false
}) {
  const r10 = parseFloat(rate10g) || 0;
  const w = parseFloat(weight) || 0;
  const lv = parseFloat(labourValue) || 0;

  // Standard Indian market rate is per 10 grams of 24K
  const baseRatePerGram = r10 / 10;

  let purityFactor = 1.0;
  let purityPercent = 100;
  let purityLabel = '24K';

  if (purityId === 'custom') {
    const cp = parseFloat(customPurityPercent) || 0;
    purityFactor = cp / 100;
    purityPercent = cp;
    purityLabel = `Custom (${cp}%)`;
  } else {
    const purityObj = GOLD_PURITIES.find(p => p.id === purityId) || GOLD_PURITIES[0];
    purityFactor = purityObj.factor;
    purityPercent = purityObj.percent;
    purityLabel = purityObj.label;
  }

  const effectiveRatePerGram = baseRatePerGram * purityFactor;
  const metalValue = w * effectiveRatePerGram;

  // Labour calculation:
  // When 'percent' is selected, labour is calculated directly on the Metal Value
  let labourAmount = 0;
  if (labourType === 'per_gram') {
    labourAmount = w * lv;
  } else if (labourType === 'percent') {
    labourAmount = metalValue * (lv / 100);
  } else {
    labourAmount = lv;
  }

  const subtotal = metalValue + labourAmount;
  const gstAmount = includeGst ? subtotal * 0.03 : 0;
  const grandTotal = subtotal + gstAmount;

  return {
    metal: 'gold',
    rateEntered: r10,
    rateUnit: '10g',
    baseRatePerGram,
    purityId,
    purityLabel,
    purityPercent,
    purityFactor,
    effectiveRatePerGram,
    weight: w,
    metalValue,
    labourType,
    labourValue: lv,
    labourAmount,
    subtotal,
    includeGst,
    gstAmount,
    grandTotal: Math.round(grandTotal * 100) / 100
  };
}

/**
 * Silver calculation based on 1kg rate input
 */
export function calculateSilver({
  rate1kg,
  weight,
  purityId = '999',
  customPurityPercent = null,
  labourType = 'flat',
  labourValue = 0,
  includeGst = false
}) {
  const r1kg = parseFloat(rate1kg) || 0;
  const w = parseFloat(weight) || 0;
  const lv = parseFloat(labourValue) || 0;

  // Standard Indian market rate is per 1 kg (1000 grams)
  const baseRatePerGram = r1kg / 1000;

  let purityFactor = 1.0;
  let purityPercent = 100;
  let purityLabel = '999';

  if (purityId === 'custom') {
    const cp = parseFloat(customPurityPercent) || 0;
    purityFactor = cp / 100;
    purityPercent = cp;
    purityLabel = `Custom (${cp}%)`;
  } else {
    const purityObj = SILVER_PURITIES.find(p => p.id === purityId) || SILVER_PURITIES[0];
    purityFactor = purityObj.factor;
    purityPercent = purityObj.percent;
    purityLabel = purityObj.label;
  }

  const effectiveRatePerGram = baseRatePerGram * purityFactor;
  const metalValue = w * effectiveRatePerGram;

  // Labour calculation:
  // When 'percent' is selected, labour is calculated directly on the Metal Value
  let labourAmount = 0;
  if (labourType === 'per_gram') {
    labourAmount = w * lv;
  } else if (labourType === 'percent') {
    labourAmount = metalValue * (lv / 100);
  } else {
    labourAmount = lv;
  }

  const subtotal = metalValue + labourAmount;
  const gstAmount = includeGst ? subtotal * 0.03 : 0;
  const grandTotal = subtotal + gstAmount;

  return {
    metal: 'silver',
    rateEntered: r1kg,
    rateUnit: '1kg',
    baseRatePerGram,
    purityId,
    purityLabel,
    purityPercent,
    purityFactor,
    effectiveRatePerGram,
    weight: w,
    metalValue,
    labourType,
    labourValue: lv,
    labourAmount,
    subtotal,
    includeGst,
    gstAmount,
    grandTotal: Math.round(grandTotal * 100) / 100
  };
}
