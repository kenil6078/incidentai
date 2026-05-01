/**
 * teamSlice.js
 * Manages: team members | invite | update role | remove
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import teamService from '../services/teamService';

// ─── Thunks ────────────────────────────────────────────────────────────────────
export const fetchTeam = createAsyncThunk(
  'team/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await teamService.getTeam();
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const inviteMember = createAsyncThunk(
  'team/invite',
  async (payload, { rejectWithValue }) => {
    try {
      return await teamService.invite(payload);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateMemberRole = createAsyncThunk(
  'team/updateRole',
  async ({ id, role }, { rejectWithValue }) => {
    try {
      return await teamService.updateRole(id, role);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const removeMember = createAsyncThunk(
  'team/remove',
  async (id, { rejectWithValue }) => {
    try {
      await teamService.remove(id);
      return id;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// ─── Slice ─────────────────────────────────────────────────────────────────────
const initialState = {
  members: [],
  loading: false,
  actionLoading: false,
  error: null,
};

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    clearTeamError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      // fetchTeam
      .addCase(fetchTeam.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTeam.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.members = payload;
      })
      .addCase(fetchTeam.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // inviteMember
      .addCase(inviteMember.pending, (state) => { state.actionLoading = true; })
      .addCase(inviteMember.fulfilled, (state) => { state.actionLoading = false; })
      .addCase(inviteMember.rejected, (state, { payload }) => {
        state.actionLoading = false;
        state.error = payload;
      })
      // updateMemberRole
      .addCase(updateMemberRole.fulfilled, (state, { payload }) => {
        const idx = state.members.findIndex((m) => m._id === payload._id);
        if (idx !== -1) state.members[idx] = payload;
      })
      // removeMember
      .addCase(removeMember.fulfilled, (state, { payload: id }) => {
        state.members = state.members.filter((m) => m._id !== id);
      });
  },
});

export const { clearTeamError } = teamSlice.actions;

// Selectors
export const selectTeam = (state) => state.team.members;
export const selectTeamLoading = (state) => state.team.loading;
export const selectTeamActionLoading = (state) => state.team.actionLoading;

export default teamSlice.reducer;
