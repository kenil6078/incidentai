import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as teamApi from './services/team.api';

export const fetchTeam = createAsyncThunk(
  'team/fetchTeam',
  async (_, { rejectWithValue }) => {
    try {
      return await teamApi.getTeam();
    } catch (err) {
      return rejectWithValue(err.response?.data || { detail: 'Failed to fetch team' });
    }
  }
);

export const inviteMember = createAsyncThunk(
  'team/invite',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const data = await teamApi.inviteMember(payload);
      dispatch(fetchTeam());
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { detail: 'Failed to invite member' });
    }
  }
);

export const updateMemberRole = createAsyncThunk(
  'team/updateRole',
  async ({ id, role }, { rejectWithValue, dispatch }) => {
    try {
      const data = await teamApi.updateRole(id, role);
      dispatch(fetchTeam());
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { detail: 'Failed to update role' });
    }
  }
);

export const removeMember = createAsyncThunk(
  'team/remove',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const data = await teamApi.removeMember(id);
      dispatch(fetchTeam());
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { detail: 'Failed to remove member' });
    }
  }
);

const initialState = {
  members: [],
  loading: false,
  error: null,
};

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeam.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
      })
      .addCase(fetchTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectTeamMembers = (state) => state.team.members;
export const selectTeamLoading = (state) => state.team.loading;

export default teamSlice.reducer;
