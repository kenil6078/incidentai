import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import incidentService from '../services/incidentService';

export const fetchIncidents = createAsyncThunk(
  'incident/fetchIncidents',
  async (params, { rejectWithValue }) => {
    try {
      return await incidentService.getIncidents(params);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch incidents');
    }
  }
);

export const fetchIncidentDetail = createAsyncThunk(
  'incident/fetchIncidentDetail',
  async (id, { rejectWithValue }) => {
    try {
      return await incidentService.getIncident(id);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch incident detail');
    }
  }
);

export const createIncident = createAsyncThunk(
  'incident/create',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const data = await incidentService.createIncident(payload);
      dispatch(fetchIncidents());
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to create incident');
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
        state.list = action.payload;
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
      });
  },
});

export const { clearCurrentIncident } = incidentSlice.actions;
export const selectIncidents = (state) => state.incident.list;
export const selectCurrentIncident = (state) => state.incident.current;
export const selectIncidentLoading = (state) => state.incident.loading;

export default incidentSlice.reducer;
