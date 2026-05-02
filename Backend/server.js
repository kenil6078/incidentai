import http from 'http';
import app from './src/app.js';
import { connectToDB } from './src/config/database.js';
import { config } from './src/config/config.js';
import { initSocket } from './src/services/socket.service.js';

const server = http.createServer(app);
const io = initSocket(server);

// Store IO in app for access in controllers
app.set('io', io);

// Handle server-level errors gracefully (e.g. port already in use)
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${config.PORT} is already in use. Please close the other process and try again.`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', err.message);
    process.exit(1);
  }
});

// MongoDB Connection
connectToDB().then(() => {
  const PORT = config.PORT;
  server.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('❌ Server failed to start due to DB connection error:', err.message);
  process.exit(1);
});
