/**
 * incidentSlice.js
 * Routes:  GET /incidents  POST /incidents  GET /incidents/:id
 *          PUT /incidents/:id  DELETE /incidents/:id
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import incidentService from '../services/incidentService';

// ─── Thunks ────────────────────────────────────────────────────────────────────
export const fetchIncidents = createAsyncThunk(
  'incident/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      return await incidentService.getAll(params);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const fetchIncidentById = createAsyncThunk(
  'incident/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await incidentService.getById(id);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const createIncident = createAsyncThunk(
  'incident/create',
  async (data, { rejectWithValue }) => {
    try {
      return await incidentService.create(data);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateIncident = createAsyncThunk(
  'incident/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await incidentService.update(id, data);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteIncident = createAsyncThunk(
  'incident/delete',
  async (id, { rejectWithValue }) => {
    try {
      await incidentService.remove(id);
      return id;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// ─── Slice ─────────────────────────────────────────────────────────────────────
const initialState = {
  items: [],
  currentIncident: null,
  loading: false,
  detailLoading: false,
  error: null,
};

const incidentSlice = createSlice({
  name: 'incident',
  initialState,
  reducers: {
    clearCurrentIncident: (state) => { state.currentIncident = null; },
    clearIncidentError: (state) => { state.error = null; },
    // Real-time socket handlers
    socketIncidentCreated: (state, { payload }) => {
      // Avoid duplicates
      if (!state.items.find((i) => i._id === payload._id)) {
        state.items.unshift(payload);
      }
    },
    socketIncidentUpdated: (state, { payload }) => {
      const idx = state.items.findIndex((i) => i._id === payload._id);
      if (idx !== -1) state.items[idx] = payload;
      if (state.currentIncident?._id === payload._id) {
        state.currentIncident = payload;
      }
    },
    socketIncidentDeleted: (state, { payload }) => {
      state.items = state.items.filter((i) => i._id !== payload.incident_id);
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchIncidents
      .addCase(fetchIncidents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncidents.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.items = payload;
      })
      .addCase(fetchIncidents.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // fetchIncidentById
      .addCase(fetchIncidentById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchIncidentById.fulfilled, (state, { payload }) => {
        state.detailLoading = false;
        state.currentIncident = payload;
      })
      .addCase(fetchIncidentById.rejected, (state, { payload }) => {
        state.detailLoading = false;
        state.error = payload;
      })
      // createIncident
      .addCase(createIncident.fulfilled, (state, { payload }) => {
        state.items.unshift(payload);
      })
      .addCase(createIncident.rejected, (state, { payload }) => {
        state.error = payload;
      })
      // updateIncident
      .addCase(updateIncident.fulfilled, (state, { payload }) => {
        const idx = state.items.findIndex((i) => i._id === payload._id);
        if (idx !== -1) state.items[idx] = payload;
        if (state.currentIncident?._id === payload._id) {
          state.currentIncident = payload;
        }
      })
      .addCase(updateIncident.rejected, (state, { payload }) => {
        state.error = payload;
      })
      // deleteIncident
      .addCase(deleteIncident.fulfilled, (state, { payload: id }) => {
        state.items = state.items.filter((i) => i._id !== id);
        if (state.currentIncident?._id === id) state.currentIncident = null;
      })
      .addCase(deleteIncident.rejected, (state, { payload }) => {
        state.error = payload;
      });
  },
});

export const {
  clearCurrentIncident,
  clearIncidentError,
  socketIncidentCreated,
  socketIncidentUpdated,
  socketIncidentDeleted,
} = incidentSlice.actions;

// Selectors
export const selectIncidents = (state) => state.incident.items;
export const selectCurrentIncident = (state) => state.incident.currentIncident;
export const selectIncidentLoading = (state) => state.incident.loading;
export const selectIncidentDetailLoading = (state) => state.incident.detailLoading;
export const selectIncidentError = (state) => state.incident.error;

export default incidentSlice.reducer;
