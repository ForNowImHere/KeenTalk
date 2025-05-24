// server.js

const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(express.json());

// Example base route
app.get('/', (req, res) => {
  res.send('🌑 KeenTalk Server is alive!');
});

// Socket.io logic
io.on('connection', (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  socket.on('chat message', (msg) => {
    console.log(`💬 Message from ${socket.id}: ${msg}`);
    io.emit('chat message', msg); // Broadcast to all clients
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`🌑 KeenTalk running on http://localhost:${PORT}`);
});
