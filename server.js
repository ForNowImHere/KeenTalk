const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Serve HTML directly at /
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>KeenTalk</title>
    </head>
    <body>
      <h1>Welcome to KeenTalk!</h1>
      <input id="name" placeholder="Your name" />
      <input id="message" placeholder="Message" />
      <button onclick="send()">Send</button>
      <ul id="chat"></ul>

      <script src="/socket.io/socket.io.js"></script>
      <script>
        const socket = io();
        const nameInput = document.getElementById('name');
        const msgInput = document.getElementById('message');
        const chat = document.getElementById('chat');

        function send() {
          const msg = msgInput.value;
          const name = nameInput.value;
          if (!name || !msg) return;
          socket.emit('chat message', { name, msg });
          msgInput.value = '';
        }

        socket.on('chat message', (data) => {
          const li = document.createElement('li');
          li.textContent = data.name + ": " + data.msg;
          chat.appendChild(li);
        });
      </script>
    </body>
    </html>
  `);
});

// Chat server
io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('chat message', (data) => {
    io.emit('chat message', data); // broadcast to all
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`KeenTalk server running on http://localhost:${PORT}`);
});
