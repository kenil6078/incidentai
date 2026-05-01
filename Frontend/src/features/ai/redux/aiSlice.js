/**
 * aiSlice.js
 * Manages: AI-generated summary | root cause | postmortem
 * Each is keyed by incidentId to avoid refetching unnecessarily.
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import aiService from '../services/aiService';

// ─── Thunks ────────────────────────────────────────────────────────────────────
export const fetchAISummary = createAsyncThunk(
  'ai/summary',
  async (incidentId, { rejectWithValue }) => {
    try {
      const data = await aiService.getSummary(incidentId);
      return { incidentId, ...data };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const fetchRootCause = createAsyncThunk(
  'ai/rootCause',
  async (incidentId, { rejectWithValue }) => {
    try {
      const data = await aiService.getRootCause(incidentId);
      return { incidentId, ...data };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const fetchPostmortem = createAsyncThunk(
  'ai/postmortem',
  async (incidentId, { rejectWithValue }) => {
    try {
      const data = await aiService.getPostmortem(incidentId);
      return { incidentId, ...data };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// ─── Slice ─────────────────────────────────────────────────────────────────────
const initialState = {
  summaries: {},     // { [incidentId]: string }
  rootCauses: {},    // { [incidentId]: string }
  postmortems: {},   // { [incidentId]: string }
  loadingKey: null,  // 'summary' | 'rootCause' | 'postmortem' | null
  error: null,
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    clearAIError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      // Summary
      .addCase(fetchAISummary.pending, (state) => { state.loadingKey = 'summary'; state.error = null; })
      .addCase(fetchAISummary.fulfilled, (state, { payload }) => {
        state.loadingKey = null;
        state.summaries[payload.incidentId] = payload.summary;
      })
      .addCase(fetchAISummary.rejected, (state, { payload }) => {
        state.loadingKey = null;
        state.error = payload;
      })
      // Root Cause
      .addCase(fetchRootCause.pending, (state) => { state.loadingKey = 'rootCause'; state.error = null; })
      .addCase(fetchRootCause.fulfilled, (state, { payload }) => {
        state.loadingKey = null;
        state.rootCauses[payload.incidentId] = payload.rootCause;
      })
      .addCase(fetchRootCause.rejected, (state, { payload }) => {
        state.loadingKey = null;
        state.error = payload;
      })
      // Postmortem
      .addCase(fetchPostmortem.pending, (state) => { state.loadingKey = 'postmortem'; state.error = null; })
      .addCase(fetchPostmortem.fulfilled, (state, { payload }) => {
        state.loadingKey = null;
        state.postmortems[payload.incidentId] = payload.postmortem;
      })
      .addCase(fetchPostmortem.rejected, (state, { payload }) => {
        state.loadingKey = null;
        state.error = payload;
      });
  },
});

export const { clearAIError } = aiSlice.actions;

// Selectors
export const selectAISummary = (id) => (state) => state.ai.summaries[id];
export const selectRootCause = (id) => (state) => state.ai.rootCauses[id];
export const selectPostmortem = (id) => (state) => state.ai.postmortems[id];
export const selectAILoadingKey = (state) => state.ai.loadingKey;
export const selectAIError = (state) => state.ai.error;

export default aiSlice.reducer;
