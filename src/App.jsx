import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { checkDailyExpiry } from './features/rates/ratesSlice';
import Header from './components/Header';
import RateAlertBanner from './components/RateAlertBanner';
import TabNavigation from './components/TabNavigation';
import GoldCalculator from './components/GoldCalculator';
import SilverCalculator from './components/SilverCalculator';
import HistoryTab from './components/HistoryTab';
import RateModal from './components/RateModal';
import ReceiptModal from './components/ReceiptModal';
import ClearAllModal from './components/ClearAllModal';
import DeleteRecordModal from './components/DeleteRecordModal';
import FormulaPreviewModal from './components/FormulaPreviewModal';
import Toast from './components/Toast';

export default function App() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);
  const activeTab = useSelector((state) => state.ui.activeTab);

  // Sync theme with document HTML tag
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Midnight day-change watcher
  // If the user leaves the tab open or returns the next morning,
  // this detects the new day and automatically clears previous day's rates!
  useEffect(() => {
    // 1. Check immediately on mount
    dispatch(checkDailyExpiry());

    // 2. Interval check every 15 seconds
    const interval = setInterval(() => {
      dispatch(checkDailyExpiry());
    }, 15000);

    // 3. Check on visibility change (phone wake-up / tab switch)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        dispatch(checkDailyExpiry());
      }
    };

    // 4. Check on window focus
    const handleFocus = () => {
      dispatch(checkDailyExpiry());
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-darkBg-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Toast />
      <Header />

      <main className="flex-1 max-w-xl w-full mx-auto px-4 pb-20">
        <RateAlertBanner />
        <TabNavigation />

        <div className="mt-2">
          {activeTab === 'gold' && <GoldCalculator />}
          {activeTab === 'silver' && <SilverCalculator />}
          {activeTab === 'history' && <HistoryTab />}
        </div>
      </main>

      {/* Global Modals */}
      <RateModal />
      <ReceiptModal />
      <ClearAllModal />
      <DeleteRecordModal />
      <FormulaPreviewModal />
    </div>
  );
}
