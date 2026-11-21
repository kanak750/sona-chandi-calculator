import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setRateModalOpen } from '../features/ui/uiSlice';
import { AlertTriangle } from 'lucide-react';

export default function RateAlertBanner() {
  const dispatch = useDispatch();
  const { goldRate, silverRate, isExpired, expiredDate } = useSelector((state) => state.rates);

  // If both rates are active, do not show banner
  if (goldRate && silverRate) return null;

  let message = "Today's Gold & Silver rates are not set!";
  if (isExpired) {
    message = `Yesterday's (${expiredDate}) rates expired! Please enter today's rates.`;
  } else if (!goldRate && silverRate) {
    message = "Today's Gold rate (per 10g) is not set!";
  } else if (goldRate && !silverRate) {
    message = "Today's Silver rate (per 1kg) is not set!";
  }

  return (
    <div className="bg-gradient-to-r from-amber-500/15 to-gold-500/10 border border-amber-500/35 rounded-xl p-3 my-3 flex items-center justify-between gap-3 shadow-sm">
      <div className="flex items-center gap-2.5">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
        <div>
          <div className="text-xs font-bold text-amber-700 dark:text-amber-400">
            {message}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Rates expire automatically at midnight as market rates change daily.
          </div>
        </div>
      </div>

      <button
        onClick={() => dispatch(setRateModalOpen(true))}
        className="bg-gold-500 hover:bg-gold-600 active:scale-95 text-darkBg-900 font-bold text-xs px-3 py-1.5 rounded-full whitespace-nowrap shadow-sm transition-transform"
      >
        Set Rates
      </button>
    </div>
  );
}
