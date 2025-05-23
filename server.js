// server.js

const express = require('express');
const { v4: uuidV4 } = require('uuid');
const { Server } = require('socket.io');
const http = require('http');
const { ExpressPeerServer } = require('peer');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/'
});

// Static files from /public
app.use(express.static('public'));

// PeerJS server mount
app.use('/peerjs', peerServer);

// Generate a random room URL
app.get('/', (req, res) => {
  res.redirect(`/room/${uuidV4()}`);
});

// Serve room HTML
app.get('/room/:room', (req, res) => {
  res.sendFile(__dirname + '/public/room.html');
});

// Handle socket connection for signaling
io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId);
    });
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🟢 KeenTalk server running at http://localhost:${PORT}`);
});
