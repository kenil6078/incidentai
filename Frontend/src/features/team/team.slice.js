import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { teamApi } from './service/team.api';

export const fetchTeam = createAsyncThunk(
  'team/fetchTeam',
  async (_, { rejectWithValue }) => {
    try {
      return await teamApi.getTeam();
    } catch (err) {
      return rejectWithValue(err.response.data);
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

export default teamSlice.reducer;

export const selectTeamMembers = (state) => state.team.members;
export const selectTeamLoading = (state) => state.team.loading;
