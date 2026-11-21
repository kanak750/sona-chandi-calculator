import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearAllRecords } from '../features/records/recordsSlice';
import { setClearAllModalOpen, showToast } from '../features/ui/uiSlice';
import { AlertOctagon } from 'lucide-react';

export default function ClearAllModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.isClearAllModalOpen);

  if (!isOpen) return null;

  const handleConfirm = () => {
    dispatch(clearAllRecords());
    dispatch(setClearAllModalOpen(false));
    dispatch(showToast({ message: 'All records have been cleared', type: 'info' }));
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={() => dispatch(setClearAllModalOpen(false))}
    >
      <div
        className="w-full max-w-sm bg-white dark:bg-darkBg-800 border border-slate-200 dark:border-slate-700 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
          <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center shrink-0">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black">Clear All Records?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Permanent action</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Are you sure you want to permanently delete all saved Gold and Silver calculation records from your local storage? This cannot be undone.
        </p>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={() => dispatch(setClearAllModalOpen(false))}
            className="py-2.5 px-4 bg-slate-100 dark:bg-darkBg-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="py-2.5 px-4 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20"
          >
            Yes, Delete All
          </button>
        </div>
      </div>
    </div>
  );
}
