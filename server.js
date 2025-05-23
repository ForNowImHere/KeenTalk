const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up file storage (in-memory for demo)
const upload = multer({ storage: multer.memoryStorage() });

let uploadedImages = [];

// Serve HTML directly
app.get('/', (req, res) => {
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Sprunki Sinner Mods</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background: #f4f4f4;
        color: #111;
        padding: 20px;
      }
      .dark-mode {
        background: #222;
        color: #eee;
      }
      textarea, input, button {
        display: block;
        margin: 10px 0;
        padding: 10px;
        width: 100%;
      }
      .image-preview {
        width: 100px;
        height: 100px;
        object-fit: cover;
        margin: 5px;
      }
    </style>
  </head>
  <body>
    <h1>Sprunki Sinner Mods</h1>
    <button onclick="toggleDark()">🌙 Toggle Dark Mode</button>

    <h2>Create Post</h2>
    <textarea id="postInput" placeholder="What's on your mind?"></textarea>
    <button onclick="addPost()">Post</button>
    <div id="posts"></div>

    <h2>Upload Image</h2>
    <form id="uploadForm" enctype="multipart/form-data">
      <input type="file" name="image" accept="image/*" />
      <button type="submit">Upload</button>
    </form>
    <div id="uploadedImages"></div>

    <h2>Chat</h2>
    <input type="text" id="chatInput" placeholder="Type a message" />
    <button onclick="sendMessage()">Send</button>
    <div id="chatBox"></div>

    <script>
      function toggleDark() {
        document.body.classList.toggle('dark-mode');
      }

      function addPost() {
        const text = document.getElementById('postInput').value;
        const div = document.createElement('div');
        div.textContent = text;
        document.getElementById('posts').appendChild(div);
        document.getElementById('postInput').value = '';
      }

      function sendMessage() {
        const msg = document.getElementById('chatInput').value;
        const chat = document.createElement('div');
        chat.textContent = 'You: ' + msg;
        document.getElementById('chatBox').appendChild(chat);
        document.getElementById('chatInput').value = '';
      }

      document.getElementById('uploadForm').onsubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);
        const res = await fetch('/upload', { method: 'POST', body: data });
        const result = await res.json();
        if (result.success) {
          const img = document.createElement('img');
          img.src = result.url;
          img.className = 'image-preview';
          document.getElementById('uploadedImages').appendChild(img);
        }
      };
    </script>
  </body>
  </html>
  `;
  res.send(html);
});

// Upload endpoint
app.post('/upload', upload.single('image'), (req, res) => {
  const imgBuffer = req.file.buffer;
  const filename = Date.now() + '-' + req.file.originalname;
  const filepath = path.join(__dirname, filename);

  fs.writeFileSync(filepath, imgBuffer);
  uploadedImages.push(filename);

  res.json({ success: true, url: '/' + filename });
});

// Serve uploaded images
app.get('/:imageName', (req, res) => {
  const filename = req.params.imageName;
  const filePath = path.join(__dirname, filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Not found');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Sprunki is live at http://localhost:${PORT}`);
});
