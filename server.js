// Full KeenTalk-style backend server
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

app.use(cors());

const users = {};      // socket.id -> username
const rooms = {};      // room name -> array of socket ids
const friends = {};    // socket.id -> array of friend socket ids

io.on("connection", (socket) => {
  socket.on("register", (username) => {
    users[socket.id] = username;
    socket.emit("registered", username);
  });

  socket.on("joinRoom", (room) => {
    socket.join(room);
    if (!rooms[room]) rooms[room] = [];
    if (!rooms[room].includes(socket.id)) {
      rooms[room].push(socket.id);
    }
    io.to(room).emit("chat", `${users[socket.id]} joined ${room}`);
  });

  socket.on("chat", ({ room, message }) => {
    if (rooms[room] && rooms[room].includes(socket.id)) {
      io.to(room).emit("chat", `${users[socket.id]}: ${message}`);
    }
  });

  socket.on("addFriend", (targetId) => {
    if (!friends[socket.id]) friends[socket.id] = [];
    if (!friends[targetId]) friends[targetId] = [];
    if (!friends[socket.id].includes(targetId)) {
      friends[socket.id].push(targetId);
    }
    io.to(targetId).emit("notify", `${users[socket.id]} sent you a friend invite!`);
  });

  socket.on("disconnect", () => {
    const username = users[socket.id];
    delete users[socket.id];
    delete friends[socket.id];
    for (const room in rooms) {
      rooms[room] = rooms[room].filter(id => id !== socket.id);
    }
  });
});

server.listen(3000, () => {
  console.log("KeenTalk backend running at http://localhost:3000");
});
