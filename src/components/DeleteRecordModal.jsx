import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setRecordToDelete, showToast } from '../features/ui/uiSlice';
import { deleteRecord } from '../features/records/recordsSlice';
import { formatCurrency, formatWeight } from '../utils/formatters';
import { Trash2 } from 'lucide-react';

export default function DeleteRecordModal() {
  const dispatch = useDispatch();
  const record = useSelector((state) => state.ui.recordToDelete);

  if (!record) return null;

  const handleConfirm = () => {
    dispatch(deleteRecord(record.id));
    dispatch(setRecordToDelete(null));
    dispatch(showToast({ message: `Deleted "${record.productName}"`, type: 'info' }));
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={() => dispatch(setRecordToDelete(null))}
    >
      <div
        className="w-full max-w-sm bg-white dark:bg-darkBg-800 border border-slate-200 dark:border-slate-700/80 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto sm:hidden mb-2" />

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">Delete Record?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">This item will be removed from history.</p>
          </div>
        </div>

        {/* Item preview card */}
        <div className="bg-slate-50 dark:bg-darkBg-900/90 rounded-2xl p-3 border border-slate-200 dark:border-slate-700/60 text-xs">
          <div className="font-bold text-slate-800 dark:text-slate-200">{record.productName}</div>
          <div className="text-[11px] text-slate-500 flex justify-between mt-1">
            <span>{record.itemType} • {formatWeight(record.weight)}</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{formatCurrency(record.grandTotal)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => dispatch(setRecordToDelete(null))}
            className="py-2.5 px-4 bg-slate-100 dark:bg-darkBg-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold active:scale-95 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="py-2.5 px-4 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-600/30 active:scale-95 transition-all"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
