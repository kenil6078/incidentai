/**
 * notificationSlice.js
 * Manages: notifications list | read-all
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as notificationApi from './services/notification.api';

// ─── Thunks ────────────────────────────────────────────────────────────────────
export const fetchNotifications = createAsyncThunk(
  'notification/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await notificationApi.getAll();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch notifications');
    }
  }
);

export const markAllRead = createAsyncThunk(
  'notification/readAll',
  async (_, { rejectWithValue }) => {
    try {
      return await notificationApi.markAllRead();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to mark notifications as read');
    }
  }
);

// ─── Slice ─────────────────────────────────────────────────────────────────────
const initialState = {
  items: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    // Called from socket events to push real-time notifications
    pushNotification: (state, { payload }) => {
      state.items.unshift(payload);
      if (!payload.read) state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => { state.loading = true; })
      .addCase(fetchNotifications.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.items = payload;
        state.unreadCount = payload.filter((n) => !n.read).length;
      })
      .addCase(fetchNotifications.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(markAllRead.fulfilled, (state) => {
        state.items = state.items.map((n) => ({ ...n, read: true }));
        state.unreadCount = 0;
      });
  },
});

export const { pushNotification } = notificationSlice.actions;

// Selectors
export const selectNotifications = (state) => state.notification.items;
export const selectUnreadCount = (state) => state.notification.unreadCount;
export const selectNotificationLoading = (state) => state.notification.loading;

export default notificationSlice.reducer;
