const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Multer setup for file uploads (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Serve the homepage with an upload form
app.get('/', (req, res) => {
  const html = `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Keen's Mini Discord</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; background: #2c2f33; color: white; }
    #chat { max-width: 600px; margin: 1rem auto; background: #23272a; padding: 1rem; border-radius: 8px; }
    #messages { list-style: none; padding: 0; max-height: 300px; overflow-y: scroll; margin-bottom: 1rem; }
    #messages li { padding: 0.2rem 0; }
    #inputArea { display: flex; }
    #inputArea input { flex-grow: 1; padding: 0.5rem; border: none; border-radius: 4px; }
    #inputArea button { margin-left: 0.5rem; padding: 0.5rem 1rem; border: none; background: #7289da; color: white; border-radius: 4px; cursor: pointer; }
    #inputArea button:hover { background: #5b6eae; }
    #voiceButton { margin-top: 1rem; background: #43b581; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; }
    #voiceButton.recording { background: #f04747; }
  </style>
</head>
<body>
  <div id="chat">
    <ul id="messages"></ul>
    <form id="form">
      <div id="inputArea">
        <input id="input" autocomplete="off" placeholder="Say something..." /><button>Send</button>
      </div>
    </form>
    <button id="voiceButton">Start Voice Chat</button>
  </div>

  <script src="/socket.io/socket.io.js"></script>
  <script>
    const socket = io();
    const form = document.getElementById('form');
    const input = document.getElementById('input');
    const messages = document.getElementById('messages');
    const voiceButton = document.getElementById('voiceButton');

    // Append message to chat list
    function appendMessage(text) {
      const li = document.createElement('li');
      li.textContent = text;
      messages.appendChild(li);
      messages.scrollTop = messages.scrollHeight;
    }

    // Handle form submit (chat)
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
      }
    });

    // Receive chat messages
    socket.on('chat message', ({ id, msg }) => {
      appendMessage(msg);
    });

    // --- Simple Voice Chat ---

    let mediaRecorder;
    let audioChunks = [];
    let isRecording = false;

    voiceButton.onclick = async () => {
      if (!isRecording) {
        // Start recording voice
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          alert('Your browser does not support voice recording.');
          return;
        }

        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.start();
          voiceButton.textContent = 'Stop Voice Chat';
          voiceButton.classList.add('recording');
          isRecording = true;

          mediaRecorder.ondataavailable = e => {
            audioChunks.push(e.data);
          };

          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            audioChunks = [];

            // Send voice audio to server (as a blob URL or binary data)
            audioBlob.arrayBuffer().then(buffer => {
              socket.emit('voice message', buffer);
            });

            voiceButton.textContent = 'Start Voice Chat';
            voiceButton.classList.remove('recording');
            isRecording = false;
          };
        } catch (err) {
          alert('Could not access your microphone.');
        }
      } else {
        // Stop recording voice
        mediaRecorder.stop();
      }
    };

    // Play incoming voice messages
    socket.on('voice message', ({ audioData }) => {
      // Reconstruct Blob and play audio
      const blob = new Blob([new Uint8Array(audioData)], { type: 'audio/webm' });
      const audioURL = URL.createObjectURL(blob);
      const audio = new Audio(audioURL);
      audio.play();
    });

  </script>
</body>
</html>
  `;
  res.send(html);
});

// File upload handler
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('❌ No file uploaded. Please select a file and try again.');
  }

  // For now, just confirm the file upload — no saving
  const fileName = req.file.originalname;

  // Send back a little HTML response with message and link back to home
  const responseHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Upload Success</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f0f0f0; padding: 2rem; text-align: center; }
        .success { color: green; font-weight: bold; }
        a { display: inline-block; margin-top: 1rem; color: #007BFF; text-decoration: none; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <h1 class="success">✅ File "${fileName}" uploaded successfully!</h1>
      <a href="/">⬅️ Go Back</a>
    </body>
    </html>
  `;

  res.send(responseHTML);
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Sprunki is live at http://localhost:${PORT}`);
});
