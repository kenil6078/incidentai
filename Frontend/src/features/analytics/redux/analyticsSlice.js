import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import analyticsService from '../services/analyticsService';

export const fetchOverview = createAsyncThunk(
  'analytics/fetchOverview',
  async (_, { rejectWithValue }) => {
    try {
      return await analyticsService.getOverview();
    } catch (err) {
      return rejectWithValue(err.response?.data || { detail: 'Failed to fetch overview' });
    }
  }
);

export const fetchIncidentTrends = createAsyncThunk(
  'analytics/fetchIncidentTrends',
  async (_, { rejectWithValue }) => {
    try {
      return await analyticsService.getIncidentTrends();
    } catch (err) {
      return rejectWithValue(err.response?.data || { detail: 'Failed to fetch trends' });
    }
  }
);

const initialState = {
  overview: null,
  trends: [],
  loading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOverview.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload;
      })
      .addCase(fetchOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchIncidentTrends.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIncidentTrends.fulfilled, (state, action) => {
        state.loading = false;
        state.trends = action.payload;
      })
      .addCase(fetchIncidentTrends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectOverview = (state) => state.analytics.overview;
export const selectIncidentTrends = (state) => state.analytics.trends;
export const selectAnalyticsLoading = (state) => state.analytics.loading;

export default analyticsSlice.reducer;
