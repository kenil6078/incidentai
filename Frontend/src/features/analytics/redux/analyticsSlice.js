import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import analyticsService from '../services/analyticsService';

export const fetchStats = createAsyncThunk(
  'analytics/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      return await analyticsService.getStats();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  stats: null,
  loading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectAnalytics = (state) => state.analytics;

export default analyticsSlice.reducer;
