const express = require('express');
const http = require('http');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Middleware to parse JSON (for chat messages)
app.use(express.json());

// Simple in-memory chat storage
let chatHistory = [];

// === Image Upload Setup === //
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = file.fieldname + '-' + Date.now() + ext;
    cb(null, safeName);
  }
});

const upload = multer({ storage });

// === Routes === //

// Serve HTML directly (no public folder needed)
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Sprunki Talk</title>
    </head>
    <body>
      <h1>Welcome to Sprunki</h1>
      <form id="uploadForm" enctype="multipart/form-data" method="POST" action="/upload">
        <input type="file" name="image"/>
        <button type="submit">Upload</button>
      </form>
      <ul id="chat"></ul>
      <input id="msg" autocomplete="off"/><button onclick="send()">Send</button>

      <script src="/socket.io/socket.io.js"></script>
      <script>
        const socket = io();
        const chat = document.getElementById('chat');
        const msgInput = document.getElementById('msg');

        socket.on('chat message', (msg) => {
          const li = document.createElement('li');
          li.innerHTML = msg;
          chat.appendChild(li);
        });

        function send() {
          const text = msgInput.value;
          socket.emit('chat message', text);
          msgInput.value = '';
        }
      </script>
    </body>
    </html>
  `);
});

// Upload endpoint (image only)
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');
  const filePath = `/uploads/${req.file.filename}`;
  io.emit('chat message', `<img src="${filePath}" style="max-height: 200px;">`);
  res.send(`Image uploaded. <a href="/">Back</a>`);
});

// Serve uploaded images
app.use('/uploads', express.static(uploadsDir));

// === Socket.IO === //
io.on('connection', (socket) => {
  console.log('🟢 A user connected');
  
  // Send chat history on connect
  chatHistory.forEach(msg => socket.emit('chat message', msg));

  socket.on('chat message', (msg) => {
    const clean = msg.trim().slice(0, 500); // Basic filter
    chatHistory.push(clean);
    io.emit('chat message', clean);
  });

  socket.on('disconnect', () => {
    console.log('🔴 A user disconnected');
  });
});

// === Start Server === //
server.listen(PORT, () => {
  console.log(`✅ Sprunki is live at http://localhost:${PORT}`);
});
