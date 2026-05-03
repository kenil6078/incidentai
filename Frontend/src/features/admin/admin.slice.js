import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as adminApi from './services/admin.api';

export const fetchOrganizations = createAsyncThunk(
  'admin/fetchOrganizations',
  async (_, { rejectWithValue }) => {
    try {
      return await adminApi.getOrganizations();
    } catch (err) {
      return rejectWithValue(err.response?.data || { detail: 'Failed to fetch organizations' });
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      return await adminApi.getUsers();
    } catch (err) {
      return rejectWithValue(err.response?.data || { detail: 'Failed to fetch users' });
    }
  }
);

export const updateUserInfo = createAsyncThunk(
  'admin/updateUserInfo',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      return await adminApi.updateUser(userId, userData);
    } catch (err) {
      return rejectWithValue(err.response?.data || { detail: 'Failed to update user' });
    }
  }
);

export const toggleUserActive = createAsyncThunk(
  'admin/toggleUserActive',
  async (userId, { rejectWithValue }) => {
    try {
      return await adminApi.toggleUserStatus(userId);
    } catch (err) {
      return rejectWithValue(err.response?.data || { detail: 'Failed to toggle user status' });
    }
  }
);

export const updateOrgSubscription = createAsyncThunk(
  'admin/updateOrgSubscription',
  async ({ orgId, plan }, { rejectWithValue }) => {
    try {
      return await adminApi.updateOrgPlan(orgId, plan);
    } catch (err) {
      return rejectWithValue(err.response?.data || { detail: 'Failed to update organization plan' });
    }
  }
);

export const removeUser = createAsyncThunk(
  'admin/removeUser',
  async (userId, { rejectWithValue }) => {
    try {
      return await adminApi.deleteUser(userId);
    } catch (err) {
      return rejectWithValue(err.response?.data || { detail: 'Failed to delete user' });
    }
  }
);

export const removeOrganization = createAsyncThunk(
  'admin/removeOrganization',
  async (orgId, { rejectWithValue }) => {
    try {
      return await adminApi.deleteOrg(orgId);
    } catch (err) {
      return rejectWithValue(err.response?.data || { detail: 'Failed to delete organization' });
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
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = { ...state.users[index], ...action.payload };
        }
      })
      .addCase(toggleUserActive.fulfilled, (state, action) => {
        const userId = action.meta.arg;
        const index = state.users.findIndex(u => u._id === userId);
        if (index !== -1) {
          state.users[index].active = action.payload.active;
        }
      })
      .addCase(updateOrgSubscription.fulfilled, (state, action) => {
        const index = state.organizations.findIndex(o => o._id === action.payload._id);
        if (index !== -1) {
          state.organizations[index] = { ...state.organizations[index], ...action.payload };
        }
      })
      .addCase(removeUser.fulfilled, (state, action) => {
        const userId = action.meta.arg;
        state.users = state.users.filter(u => u._id !== userId);
      })
      .addCase(removeOrganization.fulfilled, (state, action) => {
        const orgId = action.meta.arg;
        state.organizations = state.organizations.filter(o => o._id !== orgId);
      });
  },
});

export const selectAdminOrganizations = (state) => state.admin.organizations;
export const selectAdminUsers = (state) => state.admin.users;
export const selectAdminLoading = (state) => state.admin.loading;
export const selectAdminError = (state) => state.admin.error;

export default adminSlice.reducer;
