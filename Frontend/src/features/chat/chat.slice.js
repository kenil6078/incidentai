import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../lib/api';
const API_URL = '/chats';

export const fetchChats = createAsyncThunk('chat/fetchChats', async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get(API_URL);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch chats');
  }
});

export const fetchMessages = createAsyncThunk('chat/fetchMessages', async (chatId, { rejectWithValue }) => {
  try {
    const response = await apiClient.get(`${API_URL}/${chatId}/messages`);
    return { chatId, messages: response.data };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch messages');
  }
});

export const createChat = createAsyncThunk('chat/createChat', async (data, { rejectWithValue }) => {
  try {
    const response = await apiClient.post(API_URL, data);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to create chat');
  }
});

export const fetchUsers = createAsyncThunk('chat/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get(`${API_URL}/users`);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch users');
  }
});

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chats: [],
    currentChat: null,
    messages: {}, // { chatId: [messages] }
    users: [],
    loading: false,
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
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages[action.payload.chatId] = action.payload.messages;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        const exists = state.chats.find(c => c._id === action.payload._id);
        if (!exists) {
          state.chats.unshift(action.payload);
        }
        state.currentChat = action.payload;
      });
  }
});

export const { setCurrentChat, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
