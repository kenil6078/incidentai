import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminApi } from './service/admin.api';

export const fetchOrganizations = createAsyncThunk(
  'admin/fetchOrganizations',
  async (_, { rejectWithValue }) => {
    try {
      return await adminApi.getOrganizations();
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      return await adminApi.getUsers();
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  organizations: [],
  users: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrganizations.fulfilled, (state, action) => {
        state.loading = false;
        state.organizations = action.payload;
      })
      .addCase(fetchOrganizations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      });
  },
});

export default adminSlice.reducer;

export const selectAdminOrganizations = (state) => state.admin.organizations;
export const selectAdminUsers = (state) => state.admin.users;
export const selectAdminLoading = (state) => state.admin.loading;
export const selectAdminError = (state) => state.admin.error;
