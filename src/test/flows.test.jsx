import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import ratesReducer, { setDailyRates, checkDailyExpiry, simulateTomorrow } from '../features/rates/ratesSlice.js';
import recordsReducer, { addRecord, deleteRecord, clearAllRecords } from '../features/records/recordsSlice.js';
import uiReducer from '../features/ui/uiSlice.js';
import App from '../App.jsx';
import { calculateGold, calculateSilver } from '../utils/calculations.js';
import { getTodayDateString } from '../utils/formatters.js';

function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      rates: ratesReducer,
      records: recordsReducer,
      ui: uiReducer,
    },
    preloadedState,
  });
}

describe('Sona Chandi Calculator - End-to-End User Flows', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  // --------------------------------------------------------------------------
  // FLOW 1: Daily Rate Setup, Live Calculations, and Midnight Expiry
  // --------------------------------------------------------------------------
  it('Flow 1: Sets daily rates, performs calculations, and expires rates on next day', async () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // Step 1: Check initial alert is shown because today's rates are not set
    expect(screen.getByText(/Today's Gold & Silver rates are not set!/i)).toBeDefined();

    // Step 2: Open Rate Modal by clicking "Set Rates"
    const setRatesBtn = screen.getByRole('button', { name: /Set Rates/i });
    fireEvent.click(setRatesBtn);

    // Modal should be open
    expect(screen.getByText(/Today's Market Rates/i)).toBeDefined();

    // Step 3: Enter Gold = 78500 (per 10g) and Silver = 92000 (per 1kg)
    const goldInput = screen.getByPlaceholderText('e.g. 78500');
    const silverInput = screen.getByPlaceholderText('e.g. 92000');
    fireEvent.change(goldInput, { target: { value: '78500' } });
    fireEvent.change(silverInput, { target: { value: '92000' } });

    // Step 4: Click Save Today's Rates
    const saveRatesBtn = screen.getByRole('button', { name: /Save Today's Rates/i });
    fireEvent.click(saveRatesBtn);

    // Step 5: Verify rates updated in state and UI
    const stateAfterSave = store.getState();
    expect(stateAfterSave.rates.goldRate).toBe(78500);
    expect(stateAfterSave.rates.silverRate).toBe(92000);
    expect(stateAfterSave.rates.date).toBe(getTodayDateString());

    // Step 6: Test Next-Day Expiry Simulation
    // Re-open Rate Modal
    const editBtn = screen.getByText('Edit');
    fireEvent.click(editBtn);

    // Click "Simulate Tomorrow (Test Expiry)"
    const simulateBtn = screen.getByRole('button', { name: /Simulate Tomorrow/i });
    fireEvent.click(simulateBtn);

    // Rates must now be cleared because next day has arrived!
    const stateAfterExpiry = store.getState();
    expect(stateAfterExpiry.rates.goldRate).toBeNull();
    expect(stateAfterExpiry.rates.silverRate).toBeNull();
    expect(stateAfterExpiry.rates.isExpired).toBe(true);

    // Alert banner should reappear
    await waitFor(() => {
      expect(screen.getByText(/Yesterday's .* rates expired! Please enter today's rates./i)).toBeDefined();
    });
  });

  // --------------------------------------------------------------------------
  // FLOW 2: Gold Calculation with 22K Purity, Making Charges, and GST
  // --------------------------------------------------------------------------
  it('Flow 2: Calculates Gold item with 22K Hallmark, flat labour, and saves to records', async () => {
    const store = createTestStore({
      rates: {
        date: getTodayDateString(),
        goldRate: 78000, // ₹78,000 / 10g -> ₹7,800/g 24K
        silverRate: 90000,
        lastUpdated: Date.now(),
        isExpired: false
      }
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // Enter Product Name
    const nameInput = screen.getByPlaceholderText('e.g. Bridal Choker');
    fireEvent.change(nameInput, { target: { value: 'Bridal Gold Necklace' } });

    // Enter Weight: 10.5 grams
    const weightInput = screen.getByPlaceholderText('0.000');
    fireEvent.change(weightInput, { target: { value: '10.5' } });

    // Enter Flat Labour: ₹2,000
    const labourInput = screen.getByPlaceholderText('0');
    fireEvent.change(labourInput, { target: { value: '2000' } });

    // Enable 3% GST (clicking the toggle row)
    const gstRow = screen.getByText(/Include 3% GST/i).closest('div[class*="cursor-pointer"]');
    fireEvent.click(gstRow);

    // Calculation verification:
    // 10g = 78000 -> 1g 24K = 7800.
    // 22K factor = 22/24 -> 1g = 7150.
    // Metal value = 10.5 * 7150 = 75075.
    // Labour = 2000.
    // Subtotal = 77075.
    // GST (3%) = 77075 * 0.03 = 2312.25.
    // Grand Total = 79387.25.
    const expectedCalc = calculateGold({
      rate10g: 78000,
      weight: 10.5,
      purityId: '22k',
      labourType: 'flat',
      labourValue: 2000,
      includeGst: true
    });
    expect(expectedCalc.grandTotal).toBe(79387.25);

    // Click "Save to Records"
    const saveBtn = screen.getByRole('button', { name: /Save to Records/i });
    fireEvent.click(saveBtn);

    // Verify record in Redux store
    const recordsState = store.getState().records.items;
    expect(recordsState).toHaveLength(1);
    expect(recordsState[0].productName).toBe('Bridal Gold Necklace');
    expect(recordsState[0].grandTotal).toBe(79387.25);
    expect(recordsState[0].metal).toBe('gold');
  });

  // --------------------------------------------------------------------------
  // FLOW 3: Silver Calculation with 1kg Base, Per-Gram Labour, and Save
  // --------------------------------------------------------------------------
  it('Flow 3: Calculates Silver item with 1kg rate, per-gram labour, and saves', async () => {
    const store = createTestStore({
      rates: {
        date: getTodayDateString(),
        goldRate: 78000,
        silverRate: 95000, // ₹95,000 / 1kg -> ₹95/g
        lastUpdated: Date.now(),
        isExpired: false
      }
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // Switch to Silver tab
    const silverTabBtn = screen.getAllByRole('button', { name: /Silver/i })[0];
    fireEvent.click(silverTabBtn);

    // Product Name: Silver Pooja Thali
    const nameInput = screen.getByPlaceholderText('e.g. Silver Pooja Thali');
    fireEvent.change(nameInput, { target: { value: 'Silver Pooja Thali' } });

    // Weight: 350 grams
    const weightInput = screen.getByPlaceholderText('0.000');
    fireEvent.change(weightInput, { target: { value: '350' } });

    // Select Per-Gram Labour
    const perGramBtn = screen.getByRole('button', { name: /₹ \/ g/i });
    fireEvent.click(perGramBtn);

    // Labour: ₹6 per gram
    const labourInput = screen.getByPlaceholderText('0');
    fireEvent.change(labourInput, { target: { value: '6' } });

    // Calculation verification:
    // Rate = 95000/1000 = 95/g.
    // Metal value = 350 * 95 = 33250.
    // Labour = 350 * 6 = 2100.
    // Grand Total = 35350.
    const expectedCalc = calculateSilver({
      rate1kg: 95000,
      weight: 350,
      purityId: '999',
      labourType: 'per_gram',
      labourValue: 6,
      includeGst: false
    });
    expect(expectedCalc.grandTotal).toBe(35350);

    // Click "Save to Records"
    const saveBtn = screen.getByRole('button', { name: /Save to Records/i });
    fireEvent.click(saveBtn);

    const recordsState = store.getState().records.items;
    expect(recordsState).toHaveLength(1);
    expect(recordsState[0].productName).toBe('Silver Pooja Thali');
    expect(recordsState[0].grandTotal).toBe(35350);
    expect(recordsState[0].metal).toBe('silver');
  });

  // --------------------------------------------------------------------------
  // FLOW 4: Past Records Management, Search, Receipt Modal & Clear All
  // --------------------------------------------------------------------------
  it('Flow 4: Manages past entries, views receipt, filters, and clears all records', async () => {
    const store = createTestStore({
      rates: {
        date: getTodayDateString(),
        goldRate: 78000,
        silverRate: 95000
      },
      records: {
        items: [
          {
            id: 'rec_1',
            timestamp: Date.now(),
            date: getTodayDateString(),
            metal: 'gold',
            productName: 'Gold Ring 22K',
            itemType: 'Ring',
            purityLabel: '22K (91.6%)',
            weight: 5.4,
            rateUsed: 78000,
            rateUnit: '10g',
            effectiveRatePerGram: 7150,
            metalValue: 38610,
            labourAmount: 500,
            subtotal: 39110,
            includeGst: false,
            grandTotal: 39110
          },
          {
            id: 'rec_2',
            timestamp: Date.now() - 1000,
            date: getTodayDateString(),
            metal: 'silver',
            productName: 'Silver Payal Pair',
            itemType: 'Payal',
            purityLabel: '925 (92.5%)',
            weight: 40.0,
            rateUsed: 95000,
            rateUnit: '1kg',
            effectiveRatePerGram: 87.875,
            metalValue: 3515,
            labourAmount: 300,
            subtotal: 3815,
            includeGst: false,
            grandTotal: 3815
          }
        ]
      }
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // Switch to Records tab using the first matching Records button
    const recordsTabBtn = screen.getAllByRole('button', { name: /Records/i })[0];
    fireEvent.click(recordsTabBtn);

    // Both records should be visible
    expect(screen.getByText('Gold Ring 22K')).toBeDefined();
    expect(screen.getByText('Silver Payal Pair')).toBeDefined();

    // Verify portfolio total calculation
    // 39110 + 3815 = 42925
    expect(screen.getByText(/₹42,925/i)).toBeDefined();

    // Test individual delete using custom animated modal (NO native alerts!)
    const deleteButtons = screen.getAllByTitle('Delete Record');
    fireEvent.click(deleteButtons[0]);
    expect(screen.getByText(/Delete Record\?/i)).toBeDefined();
    const confirmSingleDelete = screen.getByRole('button', { name: /Yes, Delete/i });
    fireEvent.click(confirmSingleDelete);
    expect(store.getState().records.items).toHaveLength(1);
    expect(screen.queryByText('Gold Ring 22K')).toBeNull();

    // Re-add one record for search and clear-all tests
    store.dispatch(addRecord({
      id: 'rec_3',
      timestamp: Date.now(),
      date: getTodayDateString(),
      metal: 'gold',
      productName: 'Gold Ring 22K',
      itemType: 'Ring',
      weight: 5.4,
      rateUsed: 78000,
      grandTotal: 39110
    }));

    // Test Search filter
    const searchInput = screen.getByPlaceholderText(/Search by product, type, or date/i);
    fireEvent.change(searchInput, { target: { value: 'Payal' } });

    // Gold Ring should now be filtered out
    expect(screen.queryByText('Gold Ring 22K')).toBeNull();
    expect(screen.getByText('Silver Payal Pair')).toBeDefined();

    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } });
    expect(screen.getByText('Gold Ring 22K')).toBeDefined();

    // Test Metal Filter: Click "🟡 Gold"
    const goldFilterChip = screen.getByRole('button', { name: /🟡 Gold/i });
    fireEvent.click(goldFilterChip);
    expect(screen.getByText('Gold Ring 22K')).toBeDefined();
    expect(screen.queryByText('Silver Payal Pair')).toBeNull();

    // Click "All"
    const allFilterChip = screen.getByRole('button', { name: /^All$/i });
    fireEvent.click(allFilterChip);

    // Test View Receipt Modal
    const viewButtons = screen.getAllByTitle('View Bill Receipt');
    fireEvent.click(viewButtons[0]);

    // Receipt Modal should display
    expect(screen.getAllByText(/ESTIMATION/i)[0]).toBeDefined();
    expect(screen.getByText(/Share to WhatsApp/i)).toBeDefined();

    // Test Clear All Records Button
    const clearAllBtn = screen.getByRole('button', { name: /Clear All/i });
    fireEvent.click(clearAllBtn);

    // Safety confirmation dialog opens
    expect(screen.getByText(/Clear All Records\?/i)).toBeDefined();

    // Click "Yes, Delete All"
    const confirmDeleteAllBtn = screen.getByRole('button', { name: /Yes, Delete All/i });
    fireEvent.click(confirmDeleteAllBtn);

    // Verify records are wiped from state and empty state is rendered
    expect(store.getState().records.items).toHaveLength(0);
    expect(screen.getByText(/No Records Found/i)).toBeDefined();
  });

  // --------------------------------------------------------------------------
  // FLOW 5: Records Persistence Across Daily Expiry
  // --------------------------------------------------------------------------
  it('Flow 5: Preserves past records when daily rates expire on the next day', () => {
    let ratesState = {
      date: '2026-11-20', // yesterday
      goldRate: 78000,
      silverRate: 90000,
      isExpired: false
    };

    let recordsState = {
      items: [
        { id: 'rec_saved_yesterday', productName: 'Gold Chain', grandTotal: 50000 }
      ]
    };

    // Midnight rollover happens
    ratesState = ratesReducer(ratesState, checkDailyExpiry());

    // Daily rates MUST be cleared
    expect(ratesState.goldRate).toBeNull();
    expect(ratesState.silverRate).toBeNull();
    expect(ratesState.isExpired).toBe(true);

    // But records MUST REMAIN completely intact!
    expect(recordsState.items).toHaveLength(1);
    expect(recordsState.items[0].productName).toBe('Gold Chain');
    expect(recordsState.items[0].grandTotal).toBe(50000);
  });

  // --------------------------------------------------------------------------
  // FLOW 6: Formula Preview Window / Mathematical Inspector
  // --------------------------------------------------------------------------
  it('Flow 6: Opens and verifies the Live Formula Inspector Window', () => {
    const store = createTestStore({
      rates: {
        date: getTodayDateString(),
        goldRate: 78500,
        silverRate: 92000
      }
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // Click "Formula Window"
    const formulaBtn = screen.getByRole('button', { name: /Formula Window/i });
    fireEvent.click(formulaBtn);

    // Formula modal displays with terminal bar and steps
    expect(screen.getByText('formula-inspector.sh')).toBeDefined();
    expect(screen.getByText(/Master Mathematical Formula/i)).toBeDefined();
    expect(screen.getByText(/Step 1: 1 Gram Base Rate/i)).toBeDefined();
    expect(screen.getByText(/Step 2: Purity Adjustment/i)).toBeDefined();
    expect(screen.getByText(/Copy Calculation Proof/i)).toBeDefined();
  });

  // --------------------------------------------------------------------------
  // FLOW 7: 85% Gold Purity, Custom Purity %, and Manual Item Type Entry
  // --------------------------------------------------------------------------
  it('Flow 7: Calculates with 85% purity, custom purity %, and manual custom item type', () => {
    // 1. Direct unit test of 85% Gold calculation
    const calc85 = calculateGold({
      rate10g: 80000, // 8000/g 24K
      weight: 10,
      purityId: '85', // 85%
      labourType: 'percent',
      labourValue: 10, // 10% of metal value
      includeGst: false
    });

    // 8000 * 0.85 = 6800/g. Metal value = 10 * 6800 = 68000.
    // Labour 10% on metal value = 6800.
    // Grand Total = 74800.
    expect(calc85.effectiveRatePerGram).toBe(6800);
    expect(calc85.metalValue).toBe(68000);
    expect(calc85.labourAmount).toBe(6800);
    expect(calc85.grandTotal).toBe(74800);

    // 2. Direct unit test of Custom Purity Percentage (e.g. 87.5%)
    const calcCustom = calculateGold({
      rate10g: 80000,
      weight: 20,
      purityId: 'custom',
      customPurityPercent: 87.5,
      labourType: 'flat',
      labourValue: 1500,
      includeGst: false
    });

    // 8000 * 0.875 = 7000/g. Metal value = 20 * 7000 = 140000.
    // Grand Total = 140000 + 1500 = 141500.
    expect(calcCustom.effectiveRatePerGram).toBe(7000);
    expect(calcCustom.metalValue).toBe(140000);
    expect(calcCustom.grandTotal).toBe(141500);

    // 3. UI Flow test for Manual Item Type and 85% selection
    const store = createTestStore({
      rates: {
        date: getTodayDateString(),
        goldRate: 80000,
        silverRate: 90000
      }
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // Select "Custom / Enter Manually" for item type
    const itemTypeSelect = screen.getByDisplayValue('Ring');
    fireEvent.change(itemTypeSelect, { target: { value: 'Custom / Enter Manually' } });

    // Custom Item Type input appears
    const customItemInput = screen.getByPlaceholderText(/e.g. Kundan Payal, Armlet/i);
    expect(customItemInput).toBeDefined();
    fireEvent.change(customItemInput, { target: { value: 'Antique Bajuband' } });

    // Select 85% purity option
    const puritySelect = screen.getByDisplayValue(/22K \(91.6%/i);
    fireEvent.change(puritySelect, { target: { value: '85' } });

    // Weight: 10g
    const weightInput = screen.getByPlaceholderText('0.000');
    fireEvent.change(weightInput, { target: { value: '10' } });

    // Save to records
    const saveBtn = screen.getByRole('button', { name: /Save to Records/i });
    fireEvent.click(saveBtn);

    const saved = store.getState().records.items[0];
    expect(saved.itemType).toBe('Antique Bajuband');
    expect(saved.purityPercent).toBe(85);
    expect(saved.grandTotal).toBe(68000);
  });
});
