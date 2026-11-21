import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import ratesReducer from '../features/rates/ratesSlice';
import recordsReducer from '../features/records/recordsSlice';
import uiReducer from '../features/ui/uiSlice';

const rootReducer = combineReducers({
  rates: ratesReducer,
  records: recordsReducer,
  ui: uiReducer,
});

const persistConfig = {
  key: 'sona_chandi_app_v2',
  storage,
  whitelist: ['rates', 'records', 'ui'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
