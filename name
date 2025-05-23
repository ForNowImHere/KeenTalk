const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { ExpressPeerServer } = require('peer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const peerServer = ExpressPeerServer(server, { debug: false });

app.use('/peerjs', peerServer);

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Meeting Room</title>
  <style>
    body { margin: 0; font-family: sans-serif; background: #111; color: #eee; }
    #video-grid { display: flex; flex-wrap: wrap; gap: 10px; padding: 10px; }
    video { width: 300px; height: auto; border-radius: 10px; }
    #controls { position: fixed; bottom: 10px; left: 10px; background: #222; padding: 10px; border-radius: 5px; }
    button { margin: 5px; }
  </style>
</head>
<body>
  <h1 style="text-align:center;">🎥 Meeting Room</h1>
  <div id="video-grid"></div>
  <div id="controls">
    <button onclick="toggleMute()">🎙️ Mute</button>
    <button onclick="toggleCam()">📷 Hide Cam</button>
    <button onclick="shareScreen()">🖥️ Share Screen</button>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/peerjs@1.5.2/dist/peerjs.min.js"></script>
  <script src="/socket.io/socket.io.js"></script>
  <script>
    const socket = io();
    const videoGrid = document.getElementById('video-grid');
    const myVideo = document.createElement('video');
    myVideo.muted = true;
    let myStream;
    let myPeer = new Peer(undefined, { path: '/peerjs', host: '/', port: location.port || 80 });
    let peers = {};

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      myStream = stream;
      addVideoStream(myVideo, stream);

      myPeer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => addVideoStream(video, userVideoStream));
      });

      socket.on('user-connected', userId => connectToNewUser(userId, stream));
    });

    socket.on('user-disconnected', userId => {
      if (peers[userId]) peers[userId].close();
    });

    myPeer.on('open', id => {
      const roomId = location.pathname.split('/').pop();
      socket.emit('join-room', roomId, id);
    });

    function connectToNewUser(userId, stream) {
      const call = myPeer.call(userId, stream);
      const video = document.createElement('video');
      call.on('stream', userVideoStream => addVideoStream(video, userVideoStream));
      call.on('close', () => video.remove());
      peers[userId] = call;
    }

    function addVideoStream(video, stream) {
      video.srcObject = stream;
      video.addEventListener('loadedmetadata', () => video.play());
      videoGrid.appendChild(video);
    }

    function toggleMute() {
      myStream.getAudioTracks()[0].enabled = !myStream.getAudioTracks()[0].enabled;
    }

    function toggleCam() {
      myStream.getVideoTracks()[0].enabled = !myStream.getVideoTracks()[0].enabled;
    }

    function shareScreen() {
      navigator.mediaDevices.getDisplayMedia({ video: true, audio: true }).then(screenStream => {
        const videoTrack = screenStream.getVideoTracks()[0];
        const sender = myPeer.connections[Object.keys(peers)[0]][0].peerConnection.getSenders().find(s => s.track.kind === 'video');
        sender.replaceTrack(videoTrack);
        screenStream.getVideoTracks()[0].onended = () => {
          sender.replaceTrack(myStream.getVideoTracks()[0]);
        };
      });
    }
  </script>
</body>
</html>
`;

app.get('/', (req, res) => {
  res.redirect(`/room/${uuidv4()}`);
});

app.get('/room/:room', (req, res) => {
  res.send(html);
});

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);
    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId);
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
