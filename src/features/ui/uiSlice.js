import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeTab: 'gold', // 'gold' | 'silver' | 'history'
  theme: 'dark', // 'dark' | 'light'
  isRateModalOpen: false,
  isClearAllModalOpen: false,
  selectedRecordForReceipt: null,
  recordToDelete: null,
  formulaModalData: null,
  toast: null // { message, type: 'success' | 'warning' | 'info' | 'error', id }
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setRateModalOpen: (state, action) => {
      state.isRateModalOpen = action.payload;
    },
    setClearAllModalOpen: (state, action) => {
      state.isClearAllModalOpen = action.payload;
    },
    setSelectedRecordForReceipt: (state, action) => {
      state.selectedRecordForReceipt = action.payload;
    },
    setRecordToDelete: (state, action) => {
      state.recordToDelete = action.payload;
    },
    setFormulaModalData: (state, action) => {
      state.formulaModalData = action.payload;
    },
    showToast: (state, action) => {
      state.toast = {
        id: Date.now(),
        message: action.payload.message,
        type: action.payload.type || 'info'
      };
    },
    clearToast: (state) => {
      state.toast = null;
    }
  }
});

export const {
  setActiveTab,
  toggleTheme,
  setTheme,
  setRateModalOpen,
  setClearAllModalOpen,
  setSelectedRecordForReceipt,
  setRecordToDelete,
  setFormulaModalData,
  showToast,
  clearToast
} = uiSlice.actions;

export default uiSlice.reducer;
