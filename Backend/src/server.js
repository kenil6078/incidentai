const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// Store IO in app for access in controllers
app.set('io', io);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/incedent')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/incidents', require('./routes/incidents'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/timeline', require('./routes/timeline'));
app.use('/api/team', require('./routes/team'));
app.use('/api/services', require('./routes/services'));
app.use('/api/public', require('./routes/public'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/billing', require('./routes/billingRoutes'));

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



const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
