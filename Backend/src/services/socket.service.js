import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import userModel from '../models/user.model.js';

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

    // Automatically join the organization room
    const orgRoom = socket.user.orgId.toString();
    socket.join(orgRoom);
    console.log(`🏠 User ${socket.user.name} joined room: ${orgRoom}`);

    socket.on('disconnect', () => {
      console.log(`🔌 User Disconnected: ${socket.id}`);
    });
  });

  return io;
};
