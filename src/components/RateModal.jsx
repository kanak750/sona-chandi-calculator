import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setDailyRates, simulateTomorrow } from '../features/rates/ratesSlice';
import { setRateModalOpen, showToast } from '../features/ui/uiSlice';
import { formatDisplayDate } from '../utils/formatters';
import { X, Sparkles, Clock, FlaskConical } from 'lucide-react';

export default function RateModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.isRateModalOpen);
  const { goldRate, silverRate } = useSelector((state) => state.rates);

  const [inputGold, setInputGold] = useState('');
  const [inputSilver, setInputSilver] = useState('');

  const todayStr = formatDisplayDate(new Date());

  useEffect(() => {
    if (isOpen) {
      setInputGold(goldRate ? String(goldRate) : '');
      setInputSilver(silverRate ? String(silverRate) : '');
    }
  }, [isOpen, goldRate, silverRate]);

  if (!isOpen) return null;

  const handleSave = () => {
    dispatch(
      setDailyRates({
        goldRate: inputGold.trim() !== '' ? parseFloat(inputGold) : null,
        silverRate: inputSilver.trim() !== '' ? parseFloat(inputSilver) : null
      })
    );
    dispatch(setRateModalOpen(false));
    dispatch(showToast({ message: "Today's rates updated! Valid till midnight.", type: 'success' }));
  };

  const handleSimulate = () => {
    dispatch(simulateTomorrow());
    dispatch(setRateModalOpen(false));
    dispatch(showToast({ message: 'Simulated next day! Previous rates expired.', type: 'warning', duration: 4000 }));
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={() => dispatch(setRateModalOpen(false))}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-darkBg-800 border border-slate-200 dark:border-slate-700 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gold-500/20 text-gold-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Today's Market Rates</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">📅 {todayStr}</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(setRateModalOpen(false))}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-darkBg-700 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Expiry explanation notice */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
          <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5 leading-tight">
            <span className="font-bold">Daily Midnight Expiry:</span>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Rates entered here remain active for today only. As soon as tomorrow arrives, rates will automatically expire and reset.
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-3.5">
          <div>
            <label className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              <span>🟡 Gold Rate (for 10 Grams)</span>
              <span className="text-[11px] text-slate-400 font-normal">Standard 10g rate</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 pointer-events-none">
                ₹
              </span>
              <input
                type="number"
                step="any"
                value={inputGold}
                onChange={(e) => setInputGold(e.target.value)}
                placeholder="e.g. 78500"
                className="w-full bg-slate-50 dark:bg-darkBg-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-8 pr-16 py-2.5 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 pointer-events-none">
                / 10g
              </span>
            </div>
            {inputGold && (
              <div className="text-[11px] text-slate-500 mt-1 pl-1">
                Equivalent to ₹{(parseFloat(inputGold) / 10).toLocaleString('en-IN')} per 1 gram
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              <span>⚪ Silver Rate (for 1 Kilogram)</span>
              <span className="text-[11px] text-slate-400 font-normal">Standard 1kg rate</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 pointer-events-none">
                ₹
              </span>
              <input
                type="number"
                step="any"
                value={inputSilver}
                onChange={(e) => setInputSilver(e.target.value)}
                placeholder="e.g. 92000"
                className="w-full bg-slate-50 dark:bg-darkBg-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-8 pr-16 py-2.5 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-400/50"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 pointer-events-none">
                / 1kg
              </span>
            </div>
            {inputSilver && (
              <div className="text-[11px] text-slate-500 mt-1 pl-1">
                Equivalent to ₹{(parseFloat(inputSilver) / 1000).toLocaleString('en-IN')} per 1 gram
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-2 space-y-2">
          <button
            onClick={handleSave}
            className="w-full py-3 bg-gold-500 hover:bg-gold-600 text-darkBg-900 font-bold rounded-xl shadow-md shadow-gold-500/25 active:scale-[0.98] transition-all text-sm"
          >
            Save Today's Rates
          </button>

          <button
            type="button"
            onClick={handleSimulate}
            className="w-full py-2 bg-slate-100 dark:bg-darkBg-700 hover:bg-slate-200 dark:hover:bg-darkBg-600 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            title="Simulate the next calendar day to test rate expiration"
          >
            <FlaskConical className="w-3.5 h-3.5 text-amber-500" />
            <span>Simulate Tomorrow (Test Expiry)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
