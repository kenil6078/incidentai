import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/redux/authSlice';
import incidentReducer from '../features/incident/redux/incidentSlice';
import analyticsReducer from '../features/analytics/redux/analyticsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    incident: incidentReducer,
    analytics: analyticsReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});
