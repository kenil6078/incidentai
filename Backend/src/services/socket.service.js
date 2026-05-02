import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import userModel from '../models/user.model.js';
import chatModel from '../models/chat.model.js';
import messageModel from '../models/message.model.js';
import { encrypt } from '../utils/crypto.js';

// ──────────────────────────────────────────────────────────
//  Track online users for typing indicators & presence
// ──────────────────────────────────────────────────────────
const onlineUsers = new Map(); // userId -> Set<socketId>

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // ── Authentication Middleware ───────────────────────────
  io.use(async (socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;
      let token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

      if (!token && cookieHeader) {
        const match = cookieHeader.match(/token=([^;]+)/);
        if (match) token = match[1];
      }

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, config.JWT_SECRET);
      const user = await userModel.findById(decoded.id);

      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // ── Connection Handler ─────────────────────────────────
  io.on('connection', (socket) => {
    const userId = socket.user._id.toString();
    const orgRoom = socket.user.orgId.toString();

    console.log(`📡 User Connected: ${socket.user.name} (${socket.id})`);

    // Track online status
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);

    // Join personal room + org room
    socket.join(userId);
    socket.join(orgRoom);
    console.log(`🏠 ${socket.user.name} joined rooms: ${orgRoom}, ${userId}`);

    // ── Join Chat Rooms ────────────────────────────────
    // Auto-join all chat rooms the user is part of (for future per-chat events)
    socket.on('join_chat', (chatId) => {
      if (chatId) socket.join(`chat:${chatId}`);
    });

    socket.on('leave_chat', (chatId) => {
      if (chatId) socket.leave(`chat:${chatId}`);
    });

    // ── Send Message ───────────────────────────────────
    socket.on('send_message', async (data) => {
      try {
        const { chatId, content, type } = data;

        // 1. Encrypt content for storage (runs in parallel-safe manner)
        const encryptedContent = encrypt(content);

        // 2. Persist to database
        const newMessage = await messageModel.create({
          chatId,
          sender: socket.user._id,
          content: encryptedContent,
          type: type || 'text'
        });

        // 3. Update chat's lastMessage pointer
        const chat = await chatModel.findByIdAndUpdate(chatId, {
          lastMessage: newMessage._id
        }, { new: true }).populate('participants');

        if (!chat) {
          console.error('send_message: Chat not found:', chatId);
          return;
        }

        // 4. Populate sender info for the response
        const populatedMsg = await messageModel.findById(newMessage._id)
          .populate('sender', 'name avatar')
          .lean();

        // 5. Send DECRYPTED content to participants (content never leaves backend encrypted)
        const msgToSend = {
          ...populatedMsg,
          content, // plaintext — encryption is only at rest
        };

        // 6. Emit to every participant's personal room
        chat.participants.forEach(p => {
          io.to(p._id.toString()).emit('receive_message', msgToSend);
        });

      } catch (error) {
        console.error('Socket send_message error:', error);
        socket.emit('message_error', { error: 'Failed to send message' });
      }
    });

    // ── Typing Indicators ──────────────────────────────
    socket.on('typing_start', (data) => {
      const { chatId } = data;
      if (!chatId) return;
      // Broadcast to all participants in the chat except sender
      socket.to(`chat:${chatId}`).emit('user_typing', {
        chatId,
        userId,
        userName: socket.user.name,
      });
    });

    socket.on('typing_stop', (data) => {
      const { chatId } = data;
      if (!chatId) return;
      socket.to(`chat:${chatId}`).emit('user_stopped_typing', {
        chatId,
        userId,
      });
    });

    // ── Disconnect ─────────────────────────────────────
    socket.on('disconnect', () => {
      console.log(`🔌 User Disconnected: ${socket.id}`);
      const userSockets = onlineUsers.get(userId);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          onlineUsers.delete(userId);
        }
      }
    });
  });

  return io;
};
