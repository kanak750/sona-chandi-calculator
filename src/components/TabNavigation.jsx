import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab } from '../features/ui/uiSlice';
import { Coins, Layers, History } from 'lucide-react';

export default function TabNavigation() {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.ui.activeTab);
  const recordsCount = useSelector((state) => state.records.items.length);

  return (
    <>
      {/* Top Segmented Controls */}
      <nav className="my-3.5 bg-slate-200/80 dark:bg-darkBg-800 p-1 rounded-2xl grid grid-cols-3 gap-1 border border-slate-300 dark:border-slate-800 shadow-inner">
        <button
          onClick={() => dispatch(setActiveTab('gold'))}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'gold'
              ? 'bg-white dark:bg-darkBg-700 text-gold-600 dark:text-gold-400 shadow-sm border border-gold-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>🟡</span>
          <span>Gold (10g)</span>
        </button>

        <button
          onClick={() => dispatch(setActiveTab('silver'))}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'silver'
              ? 'bg-white dark:bg-darkBg-700 text-slate-800 dark:text-silver-300 shadow-sm border border-silver-400/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>⚪</span>
          <span>Silver (1kg)</span>
        </button>

        <button
          onClick={() => dispatch(setActiveTab('history'))}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'history'
              ? 'bg-white dark:bg-darkBg-700 text-slate-900 dark:text-white shadow-sm border border-slate-300 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>📜</span>
          <span>Records</span>
          {recordsCount > 0 && (
            <span className="bg-gold-500 text-darkBg-900 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
              {recordsCount}
            </span>
          )}
        </button>
      </nav>

      {/* Bottom Sticky Mobile Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-darkBg-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-6 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => dispatch(setActiveTab('gold'))}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-bold transition-colors ${
            activeTab === 'gold' ? 'text-gold-600 dark:text-gold-400' : 'text-slate-400 dark:text-slate-500'
          }`}
        >
          <Coins className="w-5 h-5" />
          <span>Gold</span>
        </button>

        <button
          onClick={() => dispatch(setActiveTab('silver'))}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-bold transition-colors ${
            activeTab === 'silver' ? 'text-slate-800 dark:text-silver-300' : 'text-slate-400 dark:text-slate-500'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span>Silver</span>
        </button>

        <button
          onClick={() => dispatch(setActiveTab('history'))}
          className={`relative flex flex-col items-center gap-0.5 text-[11px] font-bold transition-colors ${
            activeTab === 'history' ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'
          }`}
        >
          <History className="w-5 h-5" />
          <span>Records</span>
          {recordsCount > 0 && (
            <span className="absolute -top-1 right-1 w-2 h-2 rounded-full bg-gold-500 ring-2 ring-white dark:ring-darkBg-900" />
          )}
        </button>
      </nav>
    </>
  );
}
