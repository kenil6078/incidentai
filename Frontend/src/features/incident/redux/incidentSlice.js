import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import incidentService from '../services/incidentService';

export const fetchIncidents = createAsyncThunk(
  'incident/fetchIncidents',
  async (_, { rejectWithValue }) => {
    try {
      return await incidentService.getIncidents();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createIncident = createAsyncThunk(
  'incident/createIncident',
  async (incidentData, { rejectWithValue }) => {
    try {
      return await incidentService.createIncident(incidentData);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateIncident = createAsyncThunk(
  'incident/updateIncident',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await incidentService.updateIncident(id, data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteIncident = createAsyncThunk(
  'incident/deleteIncident',
  async (id, { rejectWithValue }) => {
    try {
      await incidentService.deleteIncident(id);
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  items: [],
  currentIncident: null,
  loading: false,
  error: null,
};

const incidentSlice = createSlice({
  name: 'incident',
  initialState,
  reducers: {
    clearCurrentIncident: (state) => {
      state.currentIncident = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Incidents
      .addCase(fetchIncidents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIncidents.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchIncidents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Incident
      .addCase(createIncident.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      // Update Incident
      .addCase(updateIncident.fulfilled, (state, action) => {
        const index = state.items.findIndex(i => i._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentIncident?._id === action.payload._id) {
          state.currentIncident = action.payload;
        }
      })
      // Delete Incident
      .addCase(deleteIncident.fulfilled, (state, action) => {
        state.items = state.items.filter(i => i._id !== action.payload);
      });
  },
});

export const { clearCurrentIncident } = incidentSlice.actions;

export const selectIncidents = (state) => state.incident.items;
export const selectCurrentIncident = (state) => state.incident.currentIncident;
export const selectIncidentLoading = (state) => state.incident.loading;

export default incidentSlice.reducer;
