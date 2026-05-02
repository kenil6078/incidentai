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
        const encryptedContent = encrypt(content);

        // 1. Create message and 2. Update chat concurrently
        const [newMessage] = await Promise.all([
          messageModel.create({
            chatId,
            sender: userId,
            content: encryptedContent,
            type: type || 'text'
          }),
          chatModel.findByIdAndUpdate(chatId, { lastMessage: null }) // We'll set it properly in a sec
        ]);

        // 3. Update chat's lastMessage pointer (fire and forget for speed)
        chatModel.findByIdAndUpdate(chatId, { lastMessage: newMessage._id }).exec();

        // 4. Prepare message to send (Avoid extra DB fetch)
        const msgToSend = {
          ...newMessage.toObject(),
          sender: {
            _id: socket.user._id,
            name: socket.user.name,
            avatar: socket.user.avatar
          },
          content // Send raw content for instant display
        };

        // 5. Emit to the room (Everyone in the chat gets it instantly)
        io.to(`chat:${chatId}`).emit('receive_message', msgToSend);

      } catch (error) {
        console.error('Socket send_message error:', error);
        socket.emit('message_error', { error: 'Failed to send message' });
      }
    });

    // ── Typing Indicators ──────────────────────────────
    socket.on('typing_start', (data) => {
      const { chatId } = data;
      if (!chatId) return;
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
