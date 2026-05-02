import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as chatApi from './services/chat.api';

// ─────────────────────────────────────────────────────────
//  Async Thunks
// ─────────────────────────────────────────────────────────

export const fetchChats = createAsyncThunk(
  'chat/fetchChats',
  async (_, { rejectWithValue }) => {
    try {
      return await chatApi.fetchChats();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async ({ chatId, before }, { rejectWithValue }) => {
    try {
      const messages = await chatApi.fetchMessages(chatId, before);
      return { chatId, messages, isMore: !!before };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createChat = createAsyncThunk(
  'chat/createChat',
  async (data, { rejectWithValue }) => {
    try {
      return await chatApi.createChat(data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchUsers = createAsyncThunk(
  'chat/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      return await chatApi.fetchUsers();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteChat = createAsyncThunk(
  'chat/deleteChat',
  async (chatId, { rejectWithValue }) => {
    try {
      await chatApi.deleteChat(chatId);
      return chatId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ─────────────────────────────────────────────────────────
//  Slice
// ─────────────────────────────────────────────────────────

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chats: [],
    currentChat: null,
    messages: {},       // { [chatId]: Message[] }
    hasMore: {},        // { [chatId]: boolean }
    typingUsers: {},    // { [chatId]: { userId, userName, timeout } }
    users: [],
    loading: false,
    loadingMore: false,
    error: null,
  },
  reducers: {
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },

    /**
     * addMessage — handles both optimistic (local) and real (socket) messages.
     *
     * Strategy for instant UX (WhatsApp-style):
     *  1. On send → immediately push an optimistic message (optimistic: true)
     *  2. When the server confirms via socket → replace the optimistic entry
     *     with the real persisted message (has a real _id, no `optimistic` flag)
     *  3. For incoming messages from other users → just append
     *  4. Duplicate detection by _id prevents double-adding
     */
    addMessage: (state, action) => {
      const msg = action.payload;
      const chatId = msg.chatId;
      if (!chatId) return;

      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }

      const messageList = state.messages[chatId];

      if (msg.optimistic) {
        // ── Optimistic message: push immediately ─────────
        messageList.push(msg);
      } else {
        // ── Real message from socket ─────────────────────
        const senderId = msg.sender?._id || msg.sender;

        // Try to find and replace the matching optimistic placeholder
        const optimisticIdx = messageList.findIndex(m =>
          m.optimistic &&
          m.content === msg.content &&
          (m.sender?._id === senderId || m.sender === senderId)
        );

        if (optimisticIdx !== -1) {
          // Swap optimistic → real
          messageList[optimisticIdx] = msg;
        } else {
          // Guard against duplicates (e.g. reconnect replays)
          const alreadyExists = messageList.some(m => m._id === msg._id);
          if (!alreadyExists) {
            messageList.push(msg);
          }
        }
      }

      // ── Keep sidebar in sync ───────────────────────────
      const chatIdx = state.chats.findIndex(c => c._id === chatId);
      if (chatIdx !== -1) {
        const chat = state.chats[chatIdx];
        chat.lastMessage = msg;
        chat.updatedAt = msg.createdAt || new Date().toISOString();
        // Move chat to top of list (most recent first)
        state.chats.splice(chatIdx, 1);
        state.chats.unshift(chat);
      }
    },

    /**
     * setTypingUser — shows "typing..." indicator per chat
     */
    setTypingUser: (state, action) => {
      const { chatId, userId, userName } = action.payload;
      if (!state.typingUsers[chatId]) {
        state.typingUsers[chatId] = {};
      }
      state.typingUsers[chatId][userId] = userName;
    },

    /**
     * clearTypingUser — clears typing indicator
     */
    clearTypingUser: (state, action) => {
      const { chatId, userId } = action.payload;
      if (state.typingUsers[chatId]) {
        delete state.typingUsers[chatId][userId];
      }
    },

    /**
     * clearMessages — clean up when leaving chat page
     */
    clearMessages: (state, action) => {
      const chatId = action.payload;
      if (chatId) {
        delete state.messages[chatId];
      }
    },
  },

  extraReducers: (builder) => {
    builder
      // ── Fetch Chats ──────────────────────────────────
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Fetch Messages ───────────────────────────────
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

      // ── Fetch Users ──────────────────────────────────
      .addCase(fetchUsers.fulfilled, (state, action) => {
        const data = action.payload;
        state.users = Array.isArray(data) ? data : (data.users || []);
      })

      // ── Create Chat ──────────────────────────────────
      .addCase(createChat.fulfilled, (state, action) => {
        const exists = state.chats.find(c => c._id === action.payload._id);
        if (!exists) {
          state.chats.unshift(action.payload);
        }
        state.currentChat = action.payload;
      })

      // ── Delete Chat ──────────────────────────────────
      .addCase(deleteChat.fulfilled, (state, action) => {
        const chatId = action.payload;
        state.chats = state.chats.filter(c => c._id !== chatId);
        delete state.messages[chatId];
        delete state.hasMore[chatId];
        delete state.typingUsers[chatId];
        if (state.currentChat?._id === chatId) {
          state.currentChat = null;
        }
      });
  }
});

export const {
  setCurrentChat,
  addMessage,
  setTypingUser,
  clearTypingUser,
  clearMessages,
} = chatSlice.actions;

export default chatSlice.reducer;
