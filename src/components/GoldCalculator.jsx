import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setRateModalOpen, setFormulaModalData, showToast } from '../features/ui/uiSlice';
import { addRecord } from '../features/records/recordsSlice';
import { calculateGold, GOLD_PURITIES, ITEM_TYPES } from '../utils/calculations';
import { formatCurrency, formatWeight } from '../utils/formatters';
import { Edit3, RotateCcw, BookmarkCheck, Sparkles, Binary, ChevronDown, ChevronUp } from 'lucide-react';

export default function GoldCalculator() {
  const dispatch = useDispatch();
  const goldRate = useSelector((state) => state.rates.goldRate);

  // Form State
  const [productName, setProductName] = useState('');
  const [itemType, setItemType] = useState('Ring');
  const [customItemType, setCustomItemType] = useState('');
  const [purityId, setPurityId] = useState('22k');
  const [customPurity, setCustomPurity] = useState('85');
  const [weight, setWeight] = useState('');
  const [labourType, setLabourType] = useState('flat'); // 'flat' | 'per_gram' | 'percent'
  const [labourValue, setLabourValue] = useState('');
  const [includeGst, setIncludeGst] = useState(false);
  const [showInlineFormula, setShowInlineFormula] = useState(false);

  // Live calculation
  const calc = useMemo(() => {
    return calculateGold({
      rate10g: goldRate || 0,
      weight: parseFloat(weight) || 0,
      purityId,
      customPurityPercent: customPurity,
      labourType,
      labourValue: parseFloat(labourValue) || 0,
      includeGst
    });
  }, [goldRate, weight, purityId, customPurity, labourType, labourValue, includeGst]);

  const handleQuickAddWeight = (increment) => {
    const current = parseFloat(weight) || 0;
    const nextVal = (current + increment).toFixed(3).replace(/\.?0+$/, '');
    setWeight(nextVal);
  };

  const handleReset = () => {
    setProductName('');
    setItemType('Ring');
    setCustomItemType('');
    setPurityId('22k');
    setCustomPurity('85');
    setWeight('');
    setLabourValue('');
    setIncludeGst(false);
    dispatch(showToast({ message: 'Gold form reset', type: 'info' }));
  };

  const handleSave = () => {
    if (!goldRate) {
      dispatch(showToast({ message: "Please enter today's Gold rate first!", type: 'warning' }));
      dispatch(setRateModalOpen(true));
      return;
    }

    const numWeight = parseFloat(weight);
    if (!numWeight || numWeight <= 0) {
      dispatch(showToast({ message: 'Please enter a valid weight in grams', type: 'warning' }));
      return;
    }

    const effectiveItemType = itemType === 'Custom / Enter Manually'
      ? (customItemType.trim() || 'Custom Jewellery')
      : itemType;

    const finalProductName = productName.trim() || 'Gold ' + effectiveItemType;

    dispatch(
      addRecord({
        metal: 'gold',
        productName: finalProductName,
        itemType: effectiveItemType,
        rateUsed: calc.rateEntered,
        rateUnit: '10g',
        purityId: calc.purityId,
        purityLabel: calc.purityLabel,
        purityPercent: calc.purityPercent,
        weight: calc.weight,
        effectiveRatePerGram: calc.effectiveRatePerGram,
        metalValue: calc.metalValue,
        labourType: calc.labourType,
        labourValue: calc.labourValue,
        labourAmount: calc.labourAmount,
        subtotal: calc.subtotal,
        includeGst: calc.includeGst,
        gstAmount: calc.gstAmount,
        grandTotal: calc.grandTotal
      })
    );

    dispatch(showToast({ message: `Saved "${finalProductName}" to records!`, type: 'success' }));
  };

  return (
    <div className="bg-white dark:bg-darkBg-800 border border-gold-500/30 rounded-3xl p-4 sm:p-5 shadow-lg shadow-gold-500/5 transition-all">
      {/* Today's Rate Card Box */}
      <div
        className={`p-3.5 rounded-2xl border mb-4 flex items-center justify-between gap-3 ${
          goldRate
            ? 'bg-gold-500/10 border-gold-500/40 text-gold-950 dark:text-gold-200'
            : 'bg-amber-500/10 border-amber-500/40 text-amber-800 dark:text-amber-300'
        }`}
      >
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Today's Gold Rate (for 10g)
          </div>
          <div className="text-base sm:text-lg font-black flex items-baseline gap-1.5 text-slate-900 dark:text-white">
            {goldRate ? (
              <>
                <span>₹{goldRate.toLocaleString('en-IN')}</span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  (₹{(goldRate / 10).toLocaleString('en-IN')} / 1g)
                </span>
              </>
            ) : (
              <span className="text-amber-600 dark:text-amber-400 text-sm">⚠️ Rate Not Set for Today</span>
            )}
          </div>
        </div>

        <button
          onClick={() => dispatch(setRateModalOpen(true))}
          className="px-3 py-1.5 rounded-full text-xs font-bold bg-white dark:bg-darkBg-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:text-gold-500 dark:hover:text-gold-400 flex items-center gap-1 shadow-sm transition-all"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{goldRate ? 'Edit Rate' : 'Enter Rate'}</span>
        </button>
      </div>

      {/* Form Fields */}
      <div className="space-y-3.5">
        {/* Product Name & Item Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Product Name
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Bridal Choker"
              className="w-full bg-slate-50 dark:bg-darkBg-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Item Type
            </label>
            <select
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
              className="w-full bg-slate-50 dark:bg-darkBg-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50"
            >
              {ITEM_TYPES.gold.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Custom Item Type Input (shown if "Custom / Enter Manually" is selected) */}
        {itemType === 'Custom / Enter Manually' && (
          <div className="p-3 bg-gold-500/5 rounded-2xl border border-gold-500/30 animate-in fade-in slide-in-from-top-1 duration-150">
            <label className="block text-xs font-bold text-gold-700 dark:text-gold-400 mb-1">
              Enter Custom Item Type Name
            </label>
            <input
              type="text"
              value={customItemType}
              onChange={(e) => setCustomItemType(e.target.value)}
              placeholder="e.g. Kundan Payal, Armlet, Traditional Kada..."
              className="w-full bg-white dark:bg-darkBg-900 border border-gold-500/50 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>
        )}

        {/* Purity Selection */}
        <div>
          <label className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            <span>Gold Purity</span>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Hallmark Standards</span>
          </label>
          <select
            value={purityId}
            onChange={(e) => setPurityId(e.target.value)}
            className="w-full bg-slate-50 dark:bg-darkBg-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50"
          >
            {GOLD_PURITIES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>

          {/* Custom Purity Percentage Input */}
          {purityId === 'custom' && (
            <div className="mt-2.5 p-3 bg-gold-500/5 rounded-2xl border border-gold-500/30 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-gold-700 dark:text-gold-400">
                  Custom Gold Purity (%)
                </label>
                <span className="text-[11px] text-slate-500">e.g. 85 for 85%, 91.6 for 22K</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  max="100"
                  value={customPurity}
                  onChange={(e) => setCustomPurity(e.target.value)}
                  placeholder="85.0"
                  className="w-full bg-white dark:bg-darkBg-900 border border-gold-500/50 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500 pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gold-500 pointer-events-none">
                  %
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Weight Input (Grams) */}
        <div>
          <label className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            <span>Weight (in Grams)</span>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Precision in milligrams</span>
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.001"
              min="0"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="0.000"
              className="w-full bg-slate-50 dark:bg-darkBg-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-base font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 pr-14"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
              grams
            </span>
          </div>

          {/* Quick Increment Chips */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-2">
            {[1, 2, 5, 8, 10, 20].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => handleQuickAddWeight(g)}
                className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 dark:bg-darkBg-700 hover:bg-gold-500/20 text-slate-700 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700 whitespace-nowrap active:scale-95 transition-all"
              >
                +{g}g {g === 8 ? '(1 Sovereign)' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Labour / Making Charges */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Labour / Making</label>
            <div className="flex bg-slate-100 dark:bg-darkBg-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setLabourType('flat')}
                className={`px-2 py-0.5 rounded-md font-semibold ${
                  labourType === 'flat'
                    ? 'bg-white dark:bg-darkBg-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                ₹ Flat
              </button>
              <button
                type="button"
                onClick={() => setLabourType('per_gram')}
                className={`px-2 py-0.5 rounded-md font-semibold ${
                  labourType === 'per_gram'
                    ? 'bg-white dark:bg-darkBg-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                ₹ / g
              </button>
              <button
                type="button"
                onClick={() => setLabourType('percent')}
                className={`px-2 py-0.5 rounded-md font-semibold ${
                  labourType === 'percent'
                    ? 'bg-white dark:bg-darkBg-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                %
              </button>
            </div>
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 pointer-events-none">
              {labourType === 'percent' ? '%' : '₹'}
            </span>
            <input
              type="number"
              step="any"
              min="0"
              value={labourValue}
              onChange={(e) => setLabourValue(e.target.value)}
              placeholder="0"
              className="w-full bg-slate-50 dark:bg-darkBg-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-8 pr-16 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 pointer-events-none">
              {labourType === 'flat' ? 'flat' : labourType === 'per_gram' ? '/ gram' : '% of metal'}
            </span>
          </div>
          {labourType === 'percent' && (
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 pl-1">
              Applied on Metal Value: {calc.labourValue || 0}% of {formatCurrency(calc.metalValue)} = <strong className="text-slate-800 dark:text-slate-200">{formatCurrency(calc.labourAmount)}</strong>
            </div>
          )}
        </div>

        {/* GST 3% Toggle Row (Entire row clickable for great mobile touch target) */}
        <div
          onClick={() => setIncludeGst(!includeGst)}
          className="flex items-center justify-between p-3 bg-slate-50 dark:bg-darkBg-900 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-gold-500/40 select-none transition-colors"
        >
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Include 3% GST</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Standard Indian jewellery tax</div>
          </div>
          <button
            type="button"
            aria-label="Toggle GST"
            className={`w-11 h-6 flex items-center rounded-full p-1 pointer-events-none transition-colors ${
              includeGst ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-darkBg-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                includeGst ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Live Calculation Summary Breakdown Card */}
      <div className="mt-5 p-4 rounded-2xl bg-gradient-to-b from-slate-100 to-white dark:from-darkBg-900 dark:to-darkBg-800 border border-gold-500/30 gold-glow">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-dashed border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-gold-500" /> Breakdown
          </span>
          <button
            type="button"
            onClick={() => dispatch(setFormulaModalData({ metal: 'gold', calc }))}
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-gold-500/15 hover:bg-gold-500/25 text-gold-700 dark:text-gold-400 font-bold text-[11px] normal-case transition-colors"
            title="Inspect full mathematical proof window"
          >
            <Binary className="w-3.5 h-3.5" />
            <span>Formula Window</span>
          </button>
        </div>

        <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex justify-between">
            <span>Base 24K Rate (10g):</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {formatCurrency(calc.rateEntered, false)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Effective Rate ({calc.purityPercent}%):</span>
            <span className="font-semibold">{formatCurrency(calc.effectiveRatePerGram)} / g</span>
          </div>

          <div className="flex justify-between font-semibold text-slate-900 dark:text-white">
            <span>Metal Value ({formatWeight(calc.weight)}):</span>
            <span>{formatCurrency(calc.metalValue)}</span>
          </div>

          <div className="flex justify-between">
            <span>
              Labour Charges (
              {calc.labourType === 'per_gram'
                ? `@ ₹${calc.labourValue}/g`
                : calc.labourType === 'percent'
                ? `@ ${calc.labourValue}%`
                : 'Flat'}
              ):
            </span>
            <span className="font-semibold text-slate-900 dark:text-white">
              + {formatCurrency(calc.labourAmount)}
            </span>
          </div>

          <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-800">
            <span>Subtotal:</span>
            <span className="font-semibold">{formatCurrency(calc.subtotal)}</span>
          </div>

          {calc.includeGst && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
              <span>GST (3%):</span>
              <span>+ {formatCurrency(calc.gstAmount)}</span>
            </div>
          )}
        </div>

        {/* Grand Total */}
        <div className="flex items-baseline justify-between pt-3 mt-2 border-t-2 border-slate-200 dark:border-slate-700">
          <div className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wide">
            Grand Total
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gold-600 dark:text-gold-400 tracking-tight">
            {formatCurrency(calc.grandTotal)}
          </div>
        </div>

        {/* Collapsible Inline Math Preview Bar */}
        <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setShowInlineFormula(!showInlineFormula)}
            className="w-full flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-gold-500 transition-colors"
          >
            <span className="flex items-center gap-1">
              <Binary className="w-3.5 h-3.5" />
              <span>Live Math Equation Preview</span>
            </span>
            {showInlineFormula ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showInlineFormula && (
            <div className="mt-2 p-2.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] leading-relaxed border border-slate-700/80 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="text-gold-400 font-bold mb-1">
                = [ ( ({calc.rateEntered} ÷ 10) × {calc.purityFactor.toFixed(4)} ) × {calc.weight || 0} ] + {calc.labourAmount} {calc.includeGst ? `+ ${calc.gstAmount.toFixed(2)}` : ''}
              </div>
              <div className="text-slate-400 text-[10px]">
                = [ ({calc.effectiveRatePerGram.toFixed(2)}/g) × {calc.weight || 0}g ] + {calc.labourAmount} = <strong className="text-white">{formatCurrency(calc.grandTotal)}</strong>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-[1fr_auto] gap-2.5 mt-4">
        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 py-3 px-4 bg-gold-500 hover:bg-gold-600 active:scale-[0.98] text-darkBg-900 font-bold rounded-xl shadow-md shadow-gold-500/25 transition-all text-sm"
        >
          <BookmarkCheck className="w-4 h-4" />
          <span>Save to Records</span>
        </button>

        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-1.5 py-3 px-3 bg-slate-100 dark:bg-darkBg-700 hover:bg-slate-200 dark:hover:bg-darkBg-600 text-slate-600 dark:text-slate-300 font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-sm transition-all"
          title="Reset form"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
