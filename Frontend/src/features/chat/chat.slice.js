import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as chatApi from './services/chat.api';

export const fetchChats = createAsyncThunk('chat/fetchChats', async (_, { rejectWithValue }) => {
  try {
    return await chatApi.fetchChats();
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch chats');
  }
});

export const fetchMessages = createAsyncThunk('chat/fetchMessages', async ({ chatId, before }, { rejectWithValue }) => {
  try {
    return await chatApi.fetchMessages(chatId, before);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch messages');
  }
});

export const createChat = createAsyncThunk('chat/createChat', async (data, { rejectWithValue }) => {
  try {
    return await chatApi.createChat(data);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to create chat');
  }
});

export const fetchUsers = createAsyncThunk('chat/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    return await chatApi.fetchUsers();
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch users');
  }
});

export const deleteChat = createAsyncThunk('chat/deleteChat', async (chatId, { rejectWithValue }) => {
  try {
    await chatApi.deleteChat(chatId);
    return chatId;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to delete chat');
  }
});

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chats: [],
    currentChat: null,
    messages: {}, // { chatId: [messages] }
    hasMore: {}, // { chatId: boolean }
    users: [],
    loading: false,
    loadingMore: false,
    error: null,
  },
  reducers: {
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    addMessage: (state, action) => {
      const { chatId, content, sender, optimistic } = action.payload;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }

      // If it's a real message from socket, check for an optimistic placeholder
      if (!optimistic) {
        const senderId = sender?._id || sender;
        const optimisticIdx = state.messages[chatId].findIndex(m =>
          m.optimistic &&
          m.content === content &&
          (m.sender?._id === senderId || m.sender === senderId)
        );

        if (optimisticIdx !== -1) {
          // Replace optimistic message with the real one
          state.messages[chatId][optimisticIdx] = action.payload;
        } else {
          // Prevent duplicates if the real message was already added
          const exists = state.messages[chatId].find(m => m._id === action.payload._id);
          if (!exists) {
            state.messages[chatId].push(action.payload);
          }
        }
      } else {
        // Just push optimistic message
        state.messages[chatId].push(action.payload);
      }

      // Update last message in chat list
      const chat = state.chats.find(c => c._id === chatId);
      if (chat) {
        chat.lastMessage = action.payload;
        state.chats = [chat, ...state.chats.filter(c => c._id !== chatId)];
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => { state.loading = true; })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchMessages.pending, (state, action) => {
        if (action.meta.arg.before) {
          state.loadingMore = true;
        } else {
          state.loading = true;
        }
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { chatId, messages, isMore } = action.payload;
        state.loading = false;
        state.loadingMore = false;

        if (isMore) {
          state.messages[chatId] = [...messages, ...(state.messages[chatId] || [])];
        } else {
          state.messages[chatId] = messages;
        }

        state.hasMore[chatId] = messages.length === 20;
      })
      .addCase(fetchMessages.rejected, (state) => {
        state.loading = false;
        state.loadingMore = false;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        const data = action.payload;
        state.users = Array.isArray(data) ? data : (data.users || []);
      })
      .addCase(createChat.fulfilled, (state, action) => {
        const exists = state.chats.find(c => c._id === action.payload._id);
        if (!exists) {
          state.chats.unshift(action.payload);
        }
        state.currentChat = action.payload;
      })
      .addCase(deleteChat.fulfilled, (state, action) => {
        state.chats = state.chats.filter(c => c._id !== action.payload);
        if (state.currentChat?._id === action.payload) {
          state.currentChat = null;
        }
      });
  }
});

export const { setCurrentChat, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
