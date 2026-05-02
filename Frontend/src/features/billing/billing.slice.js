/**
 * billingSlice.js
 * Manages: billingInfo | createOrder | verifyPayment
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as billingApi from './services/billing.api';

// ─── Thunks ────────────────────────────────────────────────────────────────────
export const fetchBillingInfo = createAsyncThunk(
  'billing/fetchInfo',
  async (_, { rejectWithValue }) => {
    try {
      return await billingApi.getInfo();
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const createOrder = createAsyncThunk(
  'billing/createOrder',
  async (payload, { rejectWithValue }) => {
    try {
      return await billingApi.createOrder(payload);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const verifyPayment = createAsyncThunk(
  'billing/verifyPayment',
  async (payload, { rejectWithValue }) => {
    try {
      return await billingApi.verifyPayment(payload);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const fetchTransactions = createAsyncThunk(
  'billing/fetchTransactions',
  async (_, { rejectWithValue }) => {
    try {
      return await billingApi.getTransactions();
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// ─── Slice ─────────────────────────────────────────────────────────────────────
const initialState = {
  plan: null,
  incidentCount: 0,
  limit: 5,
  order: null,
  transactions: [],
  loading: false,
  orderLoading: false,
  verifying: false,
  error: null,
};

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    clearBillingError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      // fetchBillingInfo
      .addCase(fetchBillingInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBillingInfo.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.plan = payload.plan;
        state.incidentCount = payload.incidentCount;
        state.limit = payload.limit;
      })
      .addCase(fetchBillingInfo.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // createOrder
      .addCase(createOrder.pending, (state) => { state.orderLoading = true; })
      .addCase(createOrder.fulfilled, (state, { payload }) => {
        state.orderLoading = false;
        state.order = payload;
      })
      .addCase(createOrder.rejected, (state, { payload }) => {
        state.orderLoading = false;
        state.error = payload;
      })
      // verifyPayment
      .addCase(verifyPayment.pending, (state) => { state.verifying = true; })
      .addCase(verifyPayment.fulfilled, (state, { payload }) => {
        state.verifying = false;
        state.plan = payload.plan || 'pro'; 
      })
      .addCase(verifyPayment.rejected, (state, { payload }) => {
        state.verifying = false;
        state.error = payload;
      })
      // fetchTransactions
      .addCase(fetchTransactions.fulfilled, (state, { payload }) => {
        state.transactions = payload;
      });
  },
});

export const { clearBillingError } = billingSlice.actions;

// Selectors
export const selectBilling = (state) => state.billing;
export const selectTransactions = (state) => state.billing.transactions;
export const selectBillingPlan = (state) => state.billing.plan;
export const selectBillingLoading = (state) => state.billing.loading;

export default billingSlice.reducer;
