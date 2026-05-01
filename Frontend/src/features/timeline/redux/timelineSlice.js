/**
 * timelineSlice.js
 * Manages: timeline entries per incident
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import timelineService from '../services/timelineService';

// ─── Thunks ────────────────────────────────────────────────────────────────────
export const fetchTimeline = createAsyncThunk(
  'timeline/fetch',
  async (incidentId, { rejectWithValue }) => {
    try {
      return await timelineService.getByIncident(incidentId);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const addTimelineEntry = createAsyncThunk(
  'timeline/add',
  async ({ incidentId, payload }, { rejectWithValue }) => {
    try {
      return await timelineService.addEntry(incidentId, payload);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// ─── Slice ─────────────────────────────────────────────────────────────────────
const initialState = {
  // Keyed by incidentId for efficient lookups: { [incidentId]: [] }
  entriesByIncident: {},
  loading: false,
  error: null,
};

const timelineSlice = createSlice({
  name: 'timeline',
  initialState,
  reducers: {
    // Real-time socket event: push a new entry
    pushTimelineEntry: (state, { payload }) => {
      const id = payload.incidentId;
      if (!state.entriesByIncident[id]) state.entriesByIncident[id] = [];
      state.entriesByIncident[id].push(payload);
    },
    clearTimeline: (state, { payload: incidentId }) => {
      delete state.entriesByIncident[incidentId];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimeline.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTimeline.fulfilled, (state, { payload, meta }) => {
        state.loading = false;
        state.entriesByIncident[meta.arg] = payload;
      })
      .addCase(fetchTimeline.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(addTimelineEntry.fulfilled, (state, { payload }) => {
        const id = payload.incidentId;
        if (!state.entriesByIncident[id]) state.entriesByIncident[id] = [];
        state.entriesByIncident[id].push(payload);
      });
  },
});

export const { pushTimelineEntry, clearTimeline } = timelineSlice.actions;

// Selectors
export const selectTimelineByIncident = (incidentId) => (state) =>
  state.timeline.entriesByIncident[incidentId] ?? [];
export const selectTimelineLoading = (state) => state.timeline.loading;

export default timelineSlice.reducer;
