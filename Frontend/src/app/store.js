/**
 * store.js — Centralized Redux store
 * Each feature contributes its own slice reducer.
 */
import { configureStore } from '@reduxjs/toolkit';

// Feature reducers
import authReducer         from '../features/auth/auth.slice';
import adminReducer        from '../features/admin/redux/adminSlice';
import incidentReducer     from '../features/incident/redux/incidentSlice';
import teamReducer         from '../features/team/redux/teamSlice';
import servicesReducer     from '../features/services/redux/servicesSlice';
import billingReducer      from '../features/billing/redux/billingSlice';
import notificationReducer from '../features/notification/redux/notificationSlice';
import timelineReducer     from '../features/timeline/redux/timelineSlice';
import aiReducer           from '../features/ai/redux/aiSlice';
import analyticsReducer    from '../features/analytics/redux/analyticsSlice';

export const store = configureStore({
  reducer: {
    auth:         authReducer,
    admin:        adminReducer,
    incident:     incidentReducer,
    team:         teamReducer,
    services:     servicesReducer,
    billing:      billingReducer,
    notification: notificationReducer,
    timeline:     timelineReducer,
    ai:           aiReducer,
    analytics:    analyticsReducer,
  },
  devTools: import.meta.env.MODE !== 'production',
});
