import React from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedRecordForReceipt, setRecordToDelete, showToast } from '../features/ui/uiSlice';
import { formatCurrency, formatWeight, formatDisplayDateTime, formatDisplayDate } from '../utils/formatters';
import { Eye, Trash2, Share2 } from 'lucide-react';

export default function HistoryCard({ item }) {
  const dispatch = useDispatch();
  const isGold = item.metal === 'gold';
  const unitText = isGold ? '10g' : '1kg';
  const purityTag = item.purityLabel ? item.purityLabel.split(' ')[0] : isGold ? '22K' : '999';

  const handleDeleteClick = () => {
    dispatch(setRecordToDelete(item));
  };

  const handleShare = () => {
    const text = `✨ *${isGold ? 'GOLD' : 'SILVER'} ESTIMATION* ✨
📦 *Item:* ${item.productName} (${item.itemType || 'Jewellery'})
💎 *Purity:* ${item.purityLabel || purityTag}
⚖️ *Weight:* ${formatWeight(item.weight)}
📈 *Rate Applied:* ₹${item.rateUsed.toLocaleString('en-IN')}/${unitText}
🔨 *Labour:* ${formatCurrency(item.labourAmount)}
${item.includeGst ? `📋 *GST (3%):* ${formatCurrency(item.gstAmount)}\n` : ''}💰 *TOTAL:* ${formatCurrency(item.grandTotal)}
📅 *Date:* ${formatDisplayDate(item.timestamp || item.date)}
Generated via Sona Chandi Calculator`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        dispatch(showToast({ message: 'Copied to clipboard for WhatsApp!', type: 'success' }));
      }).catch(() => {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
      });
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <div
      className={`bg-white dark:bg-darkBg-800 rounded-2xl p-4 border transition-all shadow-sm ${
        isGold
          ? 'border-gold-500/30 hover:border-gold-500/60 border-l-4 border-l-gold-500'
          : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 border-l-4 border-l-slate-400'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{isGold ? '🟡' : '⚪'}</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {item.productName}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            {item.itemType} • {purityTag} • 📅 {formatDisplayDateTime(item.timestamp || item.date)}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => dispatch(setSelectedRecordForReceipt(item))}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-darkBg-700 hover:bg-slate-200 dark:hover:bg-darkBg-600 text-slate-600 dark:text-slate-300"
            title="View Bill Receipt"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-darkBg-700 hover:bg-slate-200 dark:hover:bg-darkBg-600 text-slate-600 dark:text-slate-300"
            title="Share via WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDeleteClick}
            className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 active:scale-90 transition-transform"
            title="Delete Record"
            aria-label="Delete Record"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 py-2 border-y border-dashed border-slate-200 dark:border-slate-700/80 my-2 text-xs">
        <div>
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Weight</div>
          <div className="font-bold text-slate-800 dark:text-slate-200">{formatWeight(item.weight)}</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Labour</div>
          <div className="font-bold text-slate-800 dark:text-slate-200">+{formatCurrency(item.labourAmount)}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Total</div>
          <div className={`font-black text-sm ${isGold ? 'text-gold-600 dark:text-gold-400' : 'text-slate-900 dark:text-silver-200'}`}>
            {formatCurrency(item.grandTotal)}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
        <span>Rate applied: ₹{item.rateUsed.toLocaleString('en-IN')}/{unitText}</span>
        {item.includeGst && (
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Incl. 3% GST</span>
        )}
      </div>
    </div>
  );
}
