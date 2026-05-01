import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { incidentApi } from './service/incident.api';

export const fetchIncidents = createAsyncThunk(
  'incident/fetchIncidents',
  async (_, { rejectWithValue }) => {
    try {
      return await incidentApi.getIncidents();
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchIncidentDetail = createAsyncThunk(
  'incident/fetchIncidentDetail',
  async (id, { rejectWithValue }) => {
    try {
      return await incidentApi.getIncident(id);
    } catch (err) {
      return rejectWithValue(err.response.data);
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
      })
      .addCase(fetchIncidents.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchIncidents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchIncidentDetail.fulfilled, (state, action) => {
        state.current = action.payload;
      });
  },
});

export const { clearCurrentIncident } = incidentSlice.actions;
export default incidentSlice.reducer;

export const selectIncidents = (state) => state.incident.list;
export const selectCurrentIncident = (state) => state.incident.current;
export const selectIncidentLoading = (state) => state.incident.loading;
