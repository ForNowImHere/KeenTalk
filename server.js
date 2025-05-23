// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// In-memory storage
const users = {};
const sockets = {};
const friends = {};
const rooms = {};

function notify(socket, message) {
  socket.emit("notification", message);
}

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (users[username]) return res.status(400).send("User already exists.");
  users[username] = { password };
  friends[username] = [];
  res.send("Registered successfully.");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!users[username] || users[username].password !== password)
    return res.status(400).send("Invalid credentials.");
  res.send("Login successful.");
});

app.post("/add-friend", (req, res) => {
  const { from, to } = req.body;
  if (!users[to]) return res.status(404).send("User not found.");
  friends[from].push(to);
  if (sockets[to]) notify(sockets[to], `${from} added you as a friend`);
  res.send("Friend added.");
});

io.on("connection", (socket) => {
  let currentUser = "";

  socket.on("login", (username) => {
    currentUser = username;
    sockets[username] = socket;
    socket.emit("joined", `Welcome ${username}`);
  });

  socket.on("join-room", (room) => {
    socket.join(room);
    if (!rooms[room]) rooms[room] = [];
    rooms[room].push(currentUser);
    io.to(room).emit("chat", `${currentUser} joined room ${room}`);
  });

  socket.on("leave-room", (room) => {
    socket.leave(room);
    if (rooms[room])
      rooms[room] = rooms[room].filter((user) => user !== currentUser);
    io.to(room).emit("chat", `${currentUser} left room ${room}`);
  });

  socket.on("chat", ({ room, message }) => {
    io.to(room).emit("chat", `${currentUser}: ${message}`);
  });

  socket.on("voice-signal", ({ to, signal }) => {
    if (sockets[to]) sockets[to].emit("voice-signal", { from: currentUser, signal });
  });

  socket.on("disconnect", () => {
    delete sockets[currentUser];
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
