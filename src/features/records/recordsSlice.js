import { createSlice } from '@reduxjs/toolkit';
import { getTodayDateString } from '../../utils/formatters.js';

const initialState = {
  items: []
};

export const recordsSlice = createSlice({
  name: 'records',
  initialState,
  reducers: {
    addRecord: (state, action) => {
      const newRecord = {
        id: 'rec_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        timestamp: Date.now(),
        date: getTodayDateString(),
        ...action.payload
      };
      state.items.unshift(newRecord); // newest first
    },
    deleteRecord: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearAllRecords: (state) => {
      state.items = [];
    }
  }
});

export const { addRecord, deleteRecord, clearAllRecords } = recordsSlice.actions;

export default recordsSlice.reducer;
