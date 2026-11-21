import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearToast } from '../features/ui/uiSlice';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export default function Toast() {
  const dispatch = useDispatch();
  const toast = useSelector((state) => state.ui.toast);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!toast) return;

    // Trigger subtle haptic vibration on mobile
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(toast.type === 'error' ? [40, 40, 40] : 30);
    }

    setProgress(100);
    const duration = 3200;
    const intervalTime = 40;
    const decrement = (intervalTime / duration) * 100;

    const progressTimer = setInterval(() => {
      setProgress((prev) => Math.max(0, prev - decrement));
    }, intervalTime);

    const dismissTimer = setTimeout(() => {
      dispatch(clearToast());
    }, duration);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(dismissTimer);
    };
  }, [toast, dispatch]);

  if (!toast) return null;

  const config = {
    success: {
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
      border: 'border-emerald-500/40 shadow-emerald-500/10',
      bar: 'bg-emerald-500',
      badge: 'bg-emerald-500/15 text-emerald-300'
    },
    warning: {
      icon: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
      border: 'border-amber-500/40 shadow-amber-500/10',
      bar: 'bg-amber-500',
      badge: 'bg-amber-500/15 text-amber-300'
    },
    error: {
      icon: <XCircle className="w-4 h-4 text-rose-400 shrink-0" />,
      border: 'border-rose-500/40 shadow-rose-500/10',
      bar: 'bg-rose-500',
      badge: 'bg-rose-500/15 text-rose-300'
    },
    info: {
      icon: <Info className="w-4 h-4 text-sky-400 shrink-0" />,
      border: 'border-slate-600 shadow-slate-900/20',
      bar: 'bg-gold-500',
      badge: 'bg-slate-700 text-slate-300'
    }
  };

  const current = config[toast.type] || config.info;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-300">
      <div
        className={`relative overflow-hidden bg-slate-900/95 dark:bg-darkBg-800/95 backdrop-blur-xl border rounded-2xl px-4 py-3 shadow-2xl text-white ${current.border}`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {current.icon}
            <span className="text-xs font-bold leading-tight truncate">
              {toast.message}
            </span>
          </div>

          <button
            onClick={() => dispatch(clearToast())}
            className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors shrink-0"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Animated Countdown Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
          <div
            className={`h-full transition-all duration-75 ease-linear ${current.bar}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
