import { createSlice } from '@reduxjs/toolkit';
import { getTodayDateString } from '../../utils/formatters.js';

const initialState = {
  date: null, // Format: YYYY-MM-DD
  goldRate: null, // Entered for 10 grams
  silverRate: null, // Entered for 1 kilogram (1000 grams)
  lastUpdated: null,
  isExpired: false,
  expiredDate: null
};

export const ratesSlice = createSlice({
  name: 'rates',
  initialState,
  reducers: {
    setDailyRates: (state, action) => {
      const today = getTodayDateString();
      const { goldRate, silverRate } = action.payload;
      state.date = today;
      state.goldRate = goldRate !== undefined && goldRate !== null && !isNaN(goldRate) && goldRate !== '' ? Number(goldRate) : state.goldRate;
      state.silverRate = silverRate !== undefined && silverRate !== null && !isNaN(silverRate) && silverRate !== '' ? Number(silverRate) : state.silverRate;
      state.lastUpdated = Date.now();
      state.isExpired = false;
      state.expiredDate = null;
    },
    updateMetalRate: (state, action) => {
      const today = getTodayDateString();
      const { metal, rate } = action.payload;
      const numRate = rate !== undefined && rate !== null && !isNaN(rate) && rate !== '' ? Number(rate) : null;
      state.date = today;
      if (metal === 'gold') {
        state.goldRate = numRate;
      } else if (metal === 'silver') {
        state.silverRate = numRate;
      }
      state.lastUpdated = Date.now();
      state.isExpired = false;
    },
    checkDailyExpiry: (state) => {
      const today = getTodayDateString();
      // If we had rates saved for a previous date that is NOT today,
      // the rates are automatically cleared because rates change daily!
      if (state.date && state.date !== today) {
        state.expiredDate = state.date;
        state.isExpired = true;
        state.goldRate = null;
        state.silverRate = null;
        state.date = today;
        state.lastUpdated = Date.now();
      }
    },
    clearRates: (state) => {
      state.goldRate = null;
      state.silverRate = null;
      state.isExpired = false;
      state.date = getTodayDateString();
    },
    // Useful for testing / demonstration of the midnight expiry requirement
    simulateTomorrow: (state) => {
      if (state.goldRate || state.silverRate) {
        state.expiredDate = state.date || getTodayDateString();
        state.isExpired = true;
        state.goldRate = null;
        state.silverRate = null;
        state.date = '2099-01-01'; // Force future date mismatch
      }
    }
  }
});

export const {
  setDailyRates,
  updateMetalRate,
  checkDailyExpiry,
  clearRates,
  simulateTomorrow
} = ratesSlice.actions;

export default ratesSlice.reducer;
