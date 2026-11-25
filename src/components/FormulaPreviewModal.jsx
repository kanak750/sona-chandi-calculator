import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFormulaModalData, showToast } from '../features/ui/uiSlice';
import { formatCurrency, formatWeight } from '../utils/formatters';
import { X, Copy, Check, Terminal, Sparkles, HelpCircle } from 'lucide-react';

export default function FormulaPreviewModal() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.ui.formulaModalData);

  if (!data || !data.calc) return null;

  const { calc, metal } = data;
  const isGold = metal === 'gold';
  const divisor = isGold ? 10 : 1000;
  const unitName = isGold ? '10 grams' : '1 kilogram';

  let labourFormula = 'Flat charge';
  let labourMath = `₹${calc.labourAmount.toLocaleString('en-IN')}`;
  if (calc.labourType === 'per_gram') {
    labourFormula = `Weight × ₹${calc.labourValue}/g`;
    labourMath = `${formatWeight(calc.weight)} × ₹${calc.labourValue} = ${formatCurrency(calc.labourAmount)}`;
  } else if (calc.labourType === 'percent') {
    labourFormula = `Applied on Metal Value (${calc.labourValue}% of Metal Cost)`;
    labourMath = `${formatCurrency(calc.metalValue)} × ${calc.labourValue}% = ${formatCurrency(calc.labourAmount)}`;
  }

  const handleCopyFormula = () => {
    const text = `📐 ${isGold ? 'GOLD' : 'SILVER'} CALCULATION PROOF:
• Base Rate: ₹${calc.rateEntered.toLocaleString('en-IN')} per ${unitName}
• 1g Base Rate: ₹${calc.rateEntered.toLocaleString('en-IN')} ÷ ${divisor} = ₹${calc.baseRatePerGram.toLocaleString('en-IN')}/g
• Purity (${calc.purityLabel}): ₹${calc.baseRatePerGram.toLocaleString('en-IN')} × ${(calc.purityFactor ?? 1).toFixed(4)} = ₹${calc.effectiveRatePerGram.toFixed(2)}/g
• Metal Value: ${formatWeight(calc.weight)} × ₹${calc.effectiveRatePerGram.toFixed(2)} = ${formatCurrency(calc.metalValue)}
• Labour: ${labourMath}
• Subtotal: ${formatCurrency(calc.subtotal)}
${calc.includeGst ? `• GST (3%): ${formatCurrency(calc.gstAmount)}\n` : ''}• FINAL TOTAL: ${formatCurrency(calc.grandTotal)}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      dispatch(showToast({ message: 'Formula & breakdown copied to clipboard!', type: 'success' }));
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={() => dispatch(setFormulaModalData(null))}
    >
      <div
        className="w-full max-w-lg bg-darkBg-900 border border-slate-700/80 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl text-slate-200 space-y-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Header Bar with macOS dots */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-sm" />
            </div>
            <div className="ml-2 font-mono text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-gold-400" />
              <span>formula-inspector.sh</span>
            </div>
          </div>

          <button
            onClick={() => dispatch(setFormulaModalData(null))}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Header Tag */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-1.5">
              <span>{isGold ? '🟡' : '⚪'}</span>
              <span>{isGold ? 'Gold' : 'Silver'} Mathematical Proof</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Live step-by-step verification window of the exact price derivation
            </p>
          </div>

          <span
            className={`px-2.5 py-1 rounded-full text-xs font-extrabold border ${
              isGold
                ? 'bg-gold-500/10 text-gold-400 border-gold-500/30'
                : 'bg-silver-400/10 text-silver-300 border-silver-400/30'
            }`}
          >
            {isGold ? 'Base 10g' : 'Base 1kg'}
          </span>
        </div>

        {/* Master Formula Box */}
        <div className="bg-darkBg-800/90 border border-slate-700/80 rounded-2xl p-3.5 font-mono text-xs shadow-inner">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-gold-400" /> Master Mathematical Formula
          </div>
          <div className="text-gold-400 dark:text-gold-300 font-bold overflow-x-auto py-1 no-scrollbar whitespace-nowrap">
            Grand Total = [ ( (Rate ÷ {divisor}) × Purity ) × Weight ] + Labour + GST
          </div>
        </div>

        {/* Step-by-Step Live Proof */}
        <div className="space-y-2 text-xs">
          {/* Step 1 */}
          <div className="bg-darkBg-800/60 border border-slate-800 rounded-xl p-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1">
              <span>Step 1: 1 Gram Base Rate</span>
              <span className="text-slate-500">Rate ÷ {divisor}</span>
            </div>
            <div className="font-mono text-white flex justify-between items-baseline">
              <span>₹{calc.rateEntered.toLocaleString('en-IN')} ÷ {divisor}</span>
              <span className="text-emerald-400 font-bold">= {formatCurrency(calc.baseRatePerGram)} / gram</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-darkBg-800/60 border border-slate-800 rounded-xl p-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1">
              <span>Step 2: Purity Adjustment ({calc.purityLabel})</span>
              <span className="text-slate-500">Factor: {(calc.purityFactor ?? 1).toFixed(4)}</span>
            </div>
            <div className="font-mono text-white flex justify-between items-baseline">
              <span>{formatCurrency(calc.baseRatePerGram)} × {(calc.purityFactor ?? 1).toFixed(4)}</span>
              <span className="text-emerald-400 font-bold">= {formatCurrency(calc.effectiveRatePerGram)} / gram</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-darkBg-800/60 border border-slate-800 rounded-xl p-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1">
              <span>Step 3: Metal Cost</span>
              <span className="text-slate-500">Weight × Effective 1g Rate</span>
            </div>
            <div className="font-mono text-white flex justify-between items-baseline">
              <span>{formatWeight(calc.weight)} × {formatCurrency(calc.effectiveRatePerGram)}</span>
              <span className="text-gold-400 font-bold">= {formatCurrency(calc.metalValue)}</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-darkBg-800/60 border border-slate-800 rounded-xl p-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1">
              <span>Step 4: Making Charges (Labour)</span>
              <span className="text-slate-500">{labourFormula}</span>
            </div>
            <div className="font-mono text-white flex justify-between items-baseline">
              <span>{labourMath}</span>
              <span className="text-slate-300 font-bold">= + {formatCurrency(calc.labourAmount)}</span>
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-darkBg-800/60 border border-slate-800 rounded-xl p-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1">
              <span>Step 5: Subtotal (Before Tax)</span>
              <span className="text-slate-500">Metal + Labour</span>
            </div>
            <div className="font-mono text-white flex justify-between items-baseline">
              <span>{formatCurrency(calc.metalValue)} + {formatCurrency(calc.labourAmount)}</span>
              <span className="text-white font-bold">= {formatCurrency(calc.subtotal)}</span>
            </div>
          </div>

          {/* Step 6 (GST) */}
          {calc.includeGst && (
            <div className="bg-darkBg-800/60 border border-slate-800 rounded-xl p-3">
              <div className="flex items-center justify-between text-[11px] text-emerald-400 font-semibold mb-1">
                <span>Step 6: Jewellery GST (3%)</span>
                <span>Subtotal × 0.03</span>
              </div>
              <div className="font-mono text-white flex justify-between items-baseline">
                <span>{formatCurrency(calc.subtotal)} × 3%</span>
                <span className="text-emerald-400 font-bold">= + {formatCurrency(calc.gstAmount)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Grand Total Box */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-gold-500/20 via-gold-500/10 to-transparent border border-gold-500/40 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-gold-400">
              Verified Grand Total
            </div>
            <div className="text-xs text-slate-400">All terms mathematically verified</div>
          </div>
          <div className="text-2xl font-black text-gold-400 font-mono tracking-tight">
            {formatCurrency(calc.grandTotal)}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-1">
          <button
            onClick={handleCopyFormula}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-slate-700 active:scale-95 transition-all"
          >
            <Copy className="w-3.5 h-3.5 text-gold-400" />
            <span>Copy Calculation Proof</span>
          </button>
        </div>
      </div>
    </div>
  );
}
