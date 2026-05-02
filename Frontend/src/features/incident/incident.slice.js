import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as incidentApi from './services/incident.api';

export const fetchIncidents = createAsyncThunk(
  'incident/fetchIncidents',
  async (params, { rejectWithValue }) => {
    try {
      return await incidentApi.getIncidents(params);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch incidents');
    }
  }
);

export const fetchIncidentDetail = createAsyncThunk(
  'incident/fetchIncidentDetail',
  async (id, { rejectWithValue }) => {
    try {
      return await incidentApi.getIncident(id);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch incident detail');
    }
  }
);

export const createIncident = createAsyncThunk(
  'incident/create',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const data = await incidentApi.createIncident(payload);
      dispatch(fetchIncidents());
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to create incident');
    }
  }
);

export const updateIncident = createAsyncThunk(
  'incident/update',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await incidentApi.updateIncident(id, payload);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to update incident');
    }
  }
);

export const deleteIncident = createAsyncThunk(
  'incident/delete',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await incidentApi.deleteIncident(id);
      dispatch(fetchIncidents());
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to delete incident');
    }
  }
);

const initialState = {
  list: [],
  current: null,
  loading: false,
  error: null,
};

const incidentSlice = createSlice({
  name: 'incident',
  initialState,
  reducers: {
    clearCurrentIncident: (state) => {
      state.current = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncidents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncidents.fulfilled, (state, action) => {
        state.loading = false;
        state.list = Array.isArray(action.payload) ? action.payload : (action.payload.incidents || action.payload.data || []);
      })
      .addCase(fetchIncidents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchIncidentDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncidentDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchIncidentDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateIncident.fulfilled, (state, action) => {
        state.current = action.payload;
        // Also update in list if present
        const index = state.list.findIndex(i => i._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteIncident.fulfilled, (state, action) => {
        state.list = state.list.filter(i => (i._id || i.id) !== action.payload);
        if (state.current && (state.current._id === action.payload || state.current.id === action.payload)) {
          state.current = null;
        }
      });
  },
});

export const { clearCurrentIncident } = incidentSlice.actions;
export const selectIncidents = (state) => state.incident.list;
export const selectCurrentIncident = (state) => state.incident.current;
export const selectIncidentLoading = (state) => state.incident.loading;

export default incidentSlice.reducer;
