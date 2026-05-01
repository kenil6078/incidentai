/**
 * store.js — Centralized Redux store
 * Each feature contributes its own slice reducer.
 */
import { configureStore } from '@reduxjs/toolkit';

// Feature reducers
import authReducer         from '../features/auth/redux/authSlice';
import incidentReducer     from '../features/incident/redux/incidentSlice';
import analyticsReducer    from '../features/analytics/redux/analyticsSlice';
import billingReducer      from '../features/billing/redux/billingSlice';
import notificationReducer from '../features/notification/redux/notificationSlice';
import teamReducer         from '../features/team/redux/teamSlice';
import timelineReducer     from '../features/timeline/redux/timelineSlice';
import aiReducer           from '../features/ai/redux/aiSlice';
import servicesReducer     from '../features/services/redux/servicesSlice';

export const store = configureStore({
  reducer: {
    auth:         authReducer,
    incident:     incidentReducer,
    analytics:    analyticsReducer,
    billing:      billingReducer,
    notification: notificationReducer,
    team:         teamReducer,
    timeline:     timelineReducer,
    ai:           aiReducer,
    services:     servicesReducer,
  },
  devTools: import.meta.env.MODE !== 'production',
});
