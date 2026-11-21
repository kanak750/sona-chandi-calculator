import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedRecordForReceipt, showToast } from '../features/ui/uiSlice';
import { formatCurrency, formatWeight, formatDisplayDateTime, formatDisplayDate } from '../utils/formatters';
import { X, Share2, Printer } from 'lucide-react';

export default function ReceiptModal() {
  const dispatch = useDispatch();
  const record = useSelector((state) => state.ui.selectedRecordForReceipt);

  if (!record) return null;

  const isGold = record.metal === 'gold';
  const unitText = isGold ? '10g' : '1kg';

  const handleShare = () => {
    const text = `✨ *${isGold ? 'GOLD' : 'SILVER'} ESTIMATE* ✨
📦 *Item:* ${record.productName} (${record.itemType || 'Jewellery'})
💎 *Purity:* ${record.purityLabel || (isGold ? '22K' : '999')}
⚖️ *Weight:* ${formatWeight(record.weight)}
📈 *Rate Applied:* ₹${record.rateUsed.toLocaleString('en-IN')}/${unitText}
🔨 *Labour:* ${formatCurrency(record.labourAmount)}
${record.includeGst ? `📋 *GST (3%):* ${formatCurrency(record.gstAmount)}\n` : ''}💰 *FINAL TOTAL:* ${formatCurrency(record.grandTotal)}
📅 *Date:* ${formatDisplayDate(record.timestamp || record.date)}
Generated via Sona Chandi Calculator`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        dispatch(showToast({ message: 'Receipt copied for WhatsApp!', type: 'success' }));
      }).catch(() => {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
      });
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={() => dispatch(setSelectedRecordForReceipt(null))}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-darkBg-800 border border-slate-200 dark:border-slate-700 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 dark:text-white">Estimation Receipt</h3>
          <button
            onClick={() => dispatch(setSelectedRecordForReceipt(null))}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-darkBg-700 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Paper Receipt Card */}
        <div className="bg-slate-50 dark:bg-darkBg-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 font-mono text-xs text-slate-700 dark:text-slate-300 space-y-3">
          <div className="text-center pb-2 border-b border-dashed border-slate-300 dark:border-slate-700">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white tracking-wide">
              {isGold ? '🟡 GOLD' : '⚪ SILVER'} ESTIMATION
            </h4>
            <p className="text-[11px] text-slate-500 font-sans">
              Date: {formatDisplayDateTime(record.timestamp || record.date)}
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span>Product:</span>
              <strong className="text-slate-900 dark:text-white font-sans">{record.productName}</strong>
            </div>
            <div className="flex justify-between">
              <span>Item Type:</span>
              <span>{record.itemType}</span>
            </div>
            <div className="flex justify-between">
              <span>Purity:</span>
              <span>{record.purityLabel || (isGold ? '22K' : '999')}</span>
            </div>
            <div className="flex justify-between">
              <span>Net Weight:</span>
              <strong>{formatWeight(record.weight)}</strong>
            </div>
            <div className="flex justify-between">
              <span>Rate Applied:</span>
              <span>₹{record.rateUsed.toLocaleString('en-IN')} / {unitText}</span>
            </div>
            <div className="flex justify-between">
              <span>Rate / Gram:</span>
              <span>{formatCurrency(record.effectiveRatePerGram)} / g</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-800">
              <span>Metal Value:</span>
              <span>{formatCurrency(record.metalValue)}</span>
            </div>
            <div className="flex justify-between">
              <span>Labour Charges:</span>
              <span>+ {formatCurrency(record.labourAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(record.subtotal)}</span>
            </div>
            {record.includeGst && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>GST (3%):</span>
                <span>+ {formatCurrency(record.gstAmount)}</span>
              </div>
            )}
          </div>

          <div className="flex items-baseline justify-between pt-2 border-t-2 border-slate-300 dark:border-slate-700 text-sm font-black">
            <span className="text-slate-900 dark:text-white font-sans">GRAND TOTAL:</span>
            <span className={isGold ? 'text-gold-600 dark:text-gold-400' : 'text-slate-900 dark:text-white'}>
              {formatCurrency(record.grandTotal)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-[1fr_auto] gap-2 pt-1">
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 py-3 bg-gold-500 hover:bg-gold-600 text-darkBg-900 font-bold rounded-xl shadow-md text-sm active:scale-95 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>Share to WhatsApp</span>
          </button>
          <button
            onClick={handlePrint}
            className="p-3 bg-slate-100 dark:bg-darkBg-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl"
            title="Print Receipt"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
