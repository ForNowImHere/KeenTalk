const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve the UI directly from memory
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>KeenTalk Dark</title>
  <style>
    body {
      margin: 0;
      font-family: sans-serif;
      background-color: #111;
      color: #eee;
    }
    h1 {
      text-align: center;
      padding: 1em 0;
    }
    #chat {
      list-style: none;
      padding: 0;
      max-height: 60vh;
      overflow-y: auto;
    }
    li {
      padding: 8px 16px;
      border-bottom: 1px solid #333;
    }
    input, button {
      padding: 10px;
      margin: 5px;
      background: #222;
      border: 1px solid #444;
      color: #eee;
    }
    input:focus {
      outline: 1px solid #00aaff;
    }
    #form {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      padding-bottom: 1em;
    }
  </style>
</head>
<body>
  <h1>KeenTalk</h1>
  <div id="form">
    <input id="room" placeholder="Room" />
    <button onclick="joinRoom()">Join</button><br>
    <input id="name" placeholder="Your name" />
    <input id="message" placeholder="Message" />
    <button onclick="send()">Send</button>
  </div>
  <ul id="chat"></ul>

  <script src="/socket.io/socket.io.js"></script>
  <script>
    const socket = io();
    const chat = document.getElementById('chat');
    const roomInput = document.getElementById('room');
    const nameInput = document.getElementById('name');
    const msgInput = document.getElementById('message');

    function joinRoom() {
      const room = roomInput.value.trim();
      if (room) {
        socket.emit('join room', room);
        chat.innerHTML = '';
      }
    }

    function send() {
      const msg = msgInput.value.trim();
      const name = nameInput.value.trim();
      if (msg && name) {
        socket.emit('chat message', { name, msg });
        msgInput.value = '';
      }
    }

    socket.on('chat message', (data) => {
      const li = document.createElement('li');
      li.textContent = \`\${data.name}: \${data.msg}\`;
      chat.appendChild(li);
      chat.scrollTop = chat.scrollHeight;
    });
  </script>
</body>
</html>
  `);
});

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('join room', (room) => {
    socket.join(room);
    socket.room = room;
    console.log(`User joined room: ${room}`);
  });

  socket.on('chat message', (data) => {
    const room = socket.room;
    if (room) {
      io.to(room).emit('chat message', data);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(\`🌑 KeenTalk running on http://localhost:\${PORT}\`);
});
