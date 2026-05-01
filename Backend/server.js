import http from 'http';
import { Server } from 'socket.io';
import app from './src/app.js';
import { connectToDB } from './src/config/database.js';
import { config } from './src/config/config.js';

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Store IO in app for access in controllers
app.set('io', io);

// MongoDB Connection
connectToDB();


// Socket.io
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join', (orgId) => {
    socket.join(orgId);
    console.log(`User joined room: ${orgId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = config.PORT;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
