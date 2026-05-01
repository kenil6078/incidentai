/**
 * servicesSlice.js  (monitors feature)
 * Manages: services/monitors list
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import monitorService from '../services/monitorService';

// ─── Thunks ────────────────────────────────────────────────────────────────────
export const fetchServices = createAsyncThunk(
  'services/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await monitorService.getAll();
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const createService = createAsyncThunk(
  'services/create',
  async (payload, { rejectWithValue }) => {
    try {
      return await monitorService.create(payload);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// ─── Slice ─────────────────────────────────────────────────────────────────────
const initialState = {
  items: [],
  loading: false,
  createLoading: false,
  error: null,
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    clearServicesError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchServices.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.items = payload;
      })
      .addCase(fetchServices.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(createService.pending, (state) => { state.createLoading = true; })
      .addCase(createService.fulfilled, (state, { payload }) => {
        state.createLoading = false;
        state.items.push(payload);
      })
      .addCase(createService.rejected, (state, { payload }) => {
        state.createLoading = false;
        state.error = payload;
      });
  },
});

export const { clearServicesError } = servicesSlice.actions;

// Selectors
export const selectServices = (state) => state.services.items;
export const selectServicesLoading = (state) => state.services.loading;
export const selectCreateLoading = (state) => state.services.createLoading;

export default servicesSlice.reducer;
