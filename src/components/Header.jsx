import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, setRateModalOpen } from '../features/ui/uiSlice';
import { formatDisplayDate, formatCurrency } from '../utils/formatters';
import { Sun, Moon, Sliders, Edit3, Coins } from 'lucide-react';

export default function Header() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);
  const { goldRate, silverRate } = useSelector((state) => state.rates);
  const todayStr = formatDisplayDate(new Date());

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-darkBg-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-500 to-silver-300 flex items-center justify-center shadow-md shadow-gold-500/20 text-darkBg-900">
              <Coins className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight bg-gradient-to-r from-slate-900 to-gold-600 dark:from-white dark:to-gold-400 bg-clip-text text-transparent">
                Sona Chandi
              </h1>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-none">
                Gold (10g) & Silver (1kg) Calculator
              </p>
            </div>
          </div>

          {/* Action icons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-full bg-slate-100 dark:bg-darkBg-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Toggle Dark/Light Mode"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-gold-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
            <button
              onClick={() => dispatch(setRateModalOpen(true))}
              className="p-2 rounded-full bg-slate-100 dark:bg-darkBg-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Set Today's Rates"
              aria-label="Daily Rates Settings"
            >
              <Sliders className="w-4 h-4 text-gold-500" />
            </button>
          </div>
        </div>

        {/* Daily Rate Quick Bar */}
        <div
          onClick={() => dispatch(setRateModalOpen(true))}
          className="mt-2.5 bg-slate-100/80 dark:bg-darkBg-800 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2 flex items-center justify-between gap-2 cursor-pointer hover:border-gold-500/50 transition-all shadow-sm group"
        >
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
              📅 {todayStr}:
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold text-[11px] whitespace-nowrap ${
                goldRate
                  ? 'bg-gold-500/10 text-gold-700 dark:text-gold-400 border border-gold-500/30'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/40 animate-pulse'
              }`}
            >
              🟡 Gold: {goldRate ? `₹${goldRate.toLocaleString('en-IN')}/10g` : 'Not Set'}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold text-[11px] whitespace-nowrap ${
                silverRate
                  ? 'bg-slate-200 dark:bg-silver-400/10 text-slate-700 dark:text-silver-300 border border-slate-300 dark:border-silver-400/30'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/40 animate-pulse'
              }`}
            >
              ⚪ Silver: {silverRate ? `₹${silverRate.toLocaleString('en-IN')}/1kg` : 'Not Set'}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-bold text-gold-600 dark:text-gold-400 whitespace-nowrap group-hover:underline">
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </div>
        </div>
      </div>
    </header>
  );
}
