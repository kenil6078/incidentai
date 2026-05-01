import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { servicesApi } from './service/services.api';

export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async (_, { rejectWithValue }) => {
    try {
      return await servicesApi.getServices();
    } catch (err) {
      return rejectWithValue(err.response.data);
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

export default servicesSlice.reducer;

export const selectServices = (state) => state.services.list;
export const selectServicesLoading = (state) => state.services.loading;
