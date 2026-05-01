import http from 'http';
import app from './src/app.js';
import { connectToDB } from './src/config/database.js';
import { config } from './src/config/config.js';
import { initSocket } from './src/services/socket.service.js';



const server = http.createServer(app);
const io = initSocket(server);

// Store IO in app for access in controllers
app.set('io', io);

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
