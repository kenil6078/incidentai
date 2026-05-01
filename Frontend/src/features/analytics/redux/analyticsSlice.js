/**
 * analyticsSlice.js
 * Routes:  GET /analytics/overview   GET /analytics/summary
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import analyticsService from '../services/analyticsService';

// ─── Thunks ────────────────────────────────────────────────────────────────────
export const fetchOverview = createAsyncThunk(
  'analytics/fetchOverview',
  async (_, { rejectWithValue }) => {
    try {
      return await analyticsService.getOverview();
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const fetchSummary = createAsyncThunk(
  'analytics/fetchSummary',
  async (_, { rejectWithValue }) => {
    try {
      return await analyticsService.getSummary();
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// ─── Slice ─────────────────────────────────────────────────────────────────────
const initialState = {
  overview: null,   // { total, active, resolved, mttr_minutes }
  summary: null,    // { total_incidents, critical_count, mttr_minutes, by_severity, by_service }
  loading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Overview
      .addCase(fetchOverview.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchOverview.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.overview = payload;
      })
      .addCase(fetchOverview.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // Summary
      .addCase(fetchSummary.pending, (state) => { state.loading = true; })
      .addCase(fetchSummary.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.summary = payload;
      })
      .addCase(fetchSummary.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

// Selectors
export const selectOverview = (state) => state.analytics.overview;
export const selectSummary = (state) => state.analytics.summary;
export const selectAnalyticsLoading = (state) => state.analytics.loading;

export default analyticsSlice.reducer;
