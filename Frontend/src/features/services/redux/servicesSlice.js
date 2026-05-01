import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import servicesService from '../services/servicesService';

export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async (_, { rejectWithValue }) => {
    try {
      return await servicesService.getServices();
    } catch (err) {
      return rejectWithValue(err.response?.data || { detail: 'Failed to fetch services' });
    }
  }
);

export const createService = createAsyncThunk(
  'services/create',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const data = await servicesService.createService(payload);
      dispatch(fetchServices());
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { detail: 'Failed to create service' });
    }
  }
);

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectServices = (state) => state.services.list;
export const selectServicesLoading = (state) => state.services.loading;

export default servicesSlice.reducer;
