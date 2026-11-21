import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setClearAllModalOpen, showToast } from '../features/ui/uiSlice';
import HistoryCard from './HistoryCard';
import { formatCurrency, formatWeight, getTodayDateString } from '../utils/formatters';
import { Search, Trash2, Download, Inbox } from 'lucide-react';

export default function HistoryTab() {
  const dispatch = useDispatch();
  const records = useSelector((state) => state.records.items);

  const [filterMetal, setFilterMetal] = useState('all'); // 'all' | 'gold' | 'silver'
  const [searchQuery, setSearchQuery] = useState('');

  // Portfolio stats
  const stats = useMemo(() => {
    let totalVal = 0;
    let goldWeight = 0;
    let silverWeight = 0;

    records.forEach((r) => {
      totalVal += r.grandTotal || 0;
      if (r.metal === 'gold') goldWeight += r.weight || 0;
      if (r.metal === 'silver') silverWeight += r.weight || 0;
    });

    return { totalVal, goldWeight, silverWeight, count: records.length };
  }, [records]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    let list = records;
    if (filterMetal !== 'all') {
      list = list.filter((r) => r.metal === filterMetal);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (r) =>
          (r.productName && r.productName.toLowerCase().includes(q)) ||
          (r.itemType && r.itemType.toLowerCase().includes(q)) ||
          (r.date && r.date.toLowerCase().includes(q))
      );
    }
    return list;
  }, [records, filterMetal, searchQuery]);

  const handleExportCSV = () => {
    if (records.length === 0) {
      dispatch(showToast({ message: 'No records to export!', type: 'info' }));
      return;
    }

    const headers = [
      'Date',
      'Metal',
      'Product Name',
      'Item Type',
      'Purity',
      'Weight (g)',
      'Rate Applied',
      'Rate Unit',
      'Labour (₹)',
      'GST (₹)',
      'Grand Total (₹)'
    ];

    const rows = records.map((r) => [
      `"${r.date || ''}"`,
      `"${r.metal}"`,
      `"${(r.productName || '').replace(/"/g, '""')}"`,
      `"${r.itemType || ''}"`,
      `"${r.purityLabel || ''}"`,
      r.weight,
      r.rateUsed,
      `"${r.rateUnit}"`,
      r.labourAmount,
      r.gstAmount || 0,
      r.grandTotal
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sona_chandi_records_${getTodayDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    dispatch(showToast({ message: 'Records exported to CSV!', type: 'success' }));
  };

  return (
    <div className="space-y-4">
      {/* Portfolio Statistics Banner */}
      <div className="bg-white dark:bg-darkBg-800 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Saved Portfolio
            </div>
            <div className="text-xl sm:text-2xl font-black text-gold-600 dark:text-gold-400">
              {formatCurrency(stats.totalVal, false)}
            </div>
            <div className="text-xs text-slate-500">{stats.count} saved records</div>
          </div>

          <div className="text-right">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Weights
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 space-y-0.5">
              <div>🟡 {formatWeight(stats.goldWeight)}</div>
              <div>⚪ {formatWeight(stats.silverWeight)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product, type, or date..."
            className="w-full bg-white dark:bg-darkBg-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 shadow-sm"
          />
        </div>

        <div className="flex items-center justify-between gap-2">
          {/* Metal Filter Pills */}
          <div className="flex gap-1.5">
            <button
              onClick={() => setFilterMetal('all')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                filterMetal === 'all'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-darkBg-900 shadow-sm'
                  : 'bg-white dark:bg-darkBg-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterMetal('gold')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                filterMetal === 'gold'
                  ? 'bg-gold-500 text-darkBg-900 shadow-sm'
                  : 'bg-white dark:bg-darkBg-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}
            >
              🟡 Gold
            </button>
            <button
              onClick={() => setFilterMetal('silver')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                filterMetal === 'silver'
                  ? 'bg-slate-700 dark:bg-silver-300 text-white dark:text-darkBg-900 shadow-sm'
                  : 'bg-white dark:bg-darkBg-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}
            >
              ⚪ Silver
            </button>
          </div>

          {/* Export & Clear All Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleExportCSV}
              className="px-2.5 py-1 rounded-xl bg-white dark:bg-darkBg-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 shadow-sm"
              title="Export CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>

            <button
              onClick={() => {
                if (records.length === 0) {
                  dispatch(showToast({ message: 'History is already empty', type: 'info' }));
                  return;
                }
                dispatch(setClearAllModalOpen(true));
              }}
              className="px-2.5 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100 flex items-center gap-1 shadow-sm"
              title="Clear all records"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        </div>
      </div>

      {/* Records List or Empty State */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white dark:bg-darkBg-800 border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-8 text-center flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-darkBg-700 flex items-center justify-center text-slate-400 mb-1">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Records Found</h3>
          <p className="text-xs text-slate-500 max-w-xs">
            {records.length === 0
              ? 'Saved calculations will be stored here in your local storage and stay permanent across daily rate changes.'
              : 'No entries match your search query or filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRecords.map((item) => (
            <HistoryCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
