import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import userModel from '../models/user.model.js';
import chatModel from '../models/chat.model.js';
import messageModel from '../models/message.model.js';
import { encrypt } from '../utils/crypto.js';

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Socket Authentication Middleware
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

  io.on('connection', (socket) => {
    console.log(`📡 User Connected: ${socket.user.name} (${socket.id})`);

    // Automatically join rooms
    const orgRoom = socket.user.orgId.toString();
    const userRoom = socket.user._id.toString();
    socket.join(orgRoom);
    socket.join(userRoom);
    console.log(`🏠 User ${socket.user.name} joined rooms: ${orgRoom}, ${userRoom}`);

    socket.on('send_message', async (data) => {
      try {
        const { chatId, content, type } = data;
        const encryptedContent = encrypt(content);

        const newMessage = await messageModel.create({
          chatId,
          sender: socket.user._id,
          content: encryptedContent,
          type: type || 'text'
        });

        const chat = await chatModel.findByIdAndUpdate(chatId, {
          lastMessage: newMessage._id
        }, { new: true }).populate('participants');

        const populatedMsg = await messageModel.findById(newMessage._id).populate('sender', 'name avatar');
        const msgToSend = populatedMsg.toObject();
        msgToSend.content = content; // Send decrypted content to participants

        // Broadcast to all participants in the chat
        chat.participants.forEach(p => {
          io.to(p._id.toString()).emit('receive_message', msgToSend);
        });

      } catch (error) {
        console.error('Socket send_message error:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 User Disconnected: ${socket.id}`);
    });
  });

  return io;
};
