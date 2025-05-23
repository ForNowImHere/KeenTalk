const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

// In-memory storage for profile and posts
let profile = { name: "User Name", bio: "This is your bio.", picture: "" };
let posts = [];
let uploadedFiles = [];

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Main route
app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Sprunki Sinner Mods</title>
  <style>
    :root {
      --bg-color: #121212;
      --text-color: #fff;
    }
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: var(--bg-color);
      color: var(--text-color);
      transition: background-color 0.3s, color 0.3s;
    }
    .container {
      width: 90%;
      margin: auto;
      padding: 20px;
    }
    .hidden {
      display: none;
    }
    button {
      padding: 10px 15px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    button:hover {
      background-color: #0056b3;
    }
    input, textarea, select {
      padding: 10px;
      margin: 5px 0;
      border-radius: 5px;
      border: none;
    }
    .group, .post, .user, .file {
      background: #1e1e1e;
      padding: 10px;
      border-radius: 5px;
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Sprunki Sinner Mods</h1>

    <!-- Email Sign-up/Login -->
    <div id="authSection">
      <input type="email" id="email" placeholder="Email" />
      <input type="password" id="password" placeholder="Password" />
      <button onclick="signup()">Sign Up</button>
      <button onclick="login()">Login</button>
    </div>

    <!-- Profile Section -->
    <div id="profileSection" class="hidden">
      <h2>Welcome, <span id="usernameDisplay">User</span></h2>
      <textarea id="bioInput" placeholder="Your bio..."></textarea>
      <button onclick="saveProfile()">Save Bio</button>
    </div>

    <!-- Post Section -->
    <div id="postSection" class="hidden">
      <h2>Post something</h2>
      <textarea id="postInput" placeholder="Write here..."></textarea>
      <button onclick="createPost()">Post</button>
      <div id="postList"></div>
    </div>

    <!-- Friends Section -->
    <div id="friendsSection" class="hidden">
      <h2>Friends</h2>
      <input type="text" id="friendEmail" placeholder="Friend's email" />
      <button onclick="addFriend()">Add Friend</button>
      <div id="friendList"></div>
    </div>

    <!-- Groups Section -->
    <div id="groupsSection" class="hidden">
      <h2>Groups</h2>
      <input type="text" id="groupName" placeholder="Group name" />
      <button onclick="createGroup()">Create Group</button>
      <div id="groupList"></div>
    </div>

    <!-- File Upload Section -->
    <div id="uploadSection" class="hidden">
      <h2>Upload a Game/Mod</h2>
      <input type="file" id="fileInput" />
      <button onclick="uploadFile()">Upload</button>
      <div id="fileList"></div>
    </div>

    <!-- Call Section -->
    <div id="callSection" class="hidden">
      <h2>Call a Friend</h2>
      <input type="text" id="callTarget" placeholder="Friend's email" />
      <button onclick="startCall()">Start Call</button>
      <video id="localVideo" autoplay muted></video>
      <video id="remoteVideo" autoplay></video>
    </div>
  </div>

  <script>
    const user = {
      email: '',
      name: 'User',
      bio: '',
      vip: false,
      darkMode: true,
    };

    function signup() {
      user.email = document.getElementById("email").value;
      user.name = user.email.split("@")[0];
      alert("Signed up successfully!");
      enableApp();
    }

    function login() {
      user.email = document.getElementById("email").value;
      user.name = user.email.split("@")[0];
      alert("Logged in!");
      enableApp();
    }

    function enableApp() {
      document.getElementById("authSection").classList.add("hidden");
      document.getElementById("profileSection").classList.remove("hidden");
      document.getElementById("postSection").classList.remove("hidden");
      document.getElementById("friendsSection").classList.remove("hidden");
      document.getElementById("groupsSection").classList.remove("hidden");
      document.getElementById("uploadSection").classList.remove("hidden");
      document.getElementById("callSection").classList.remove("hidden");
      document.getElementById("usernameDisplay").innerText = user.name;
    }

    function saveProfile() {
      user.bio = document.getElementById("bioInput").value;
      alert("Profile saved.");
    }

    function createPost() {
      const text = document.getElementById("postInput").value;
      const post = document.createElement("div");
      post.className = "post";
      post.textContent = text;
      document.getElementById("postList").appendChild(post);
    }

    function addFriend() {
      const friend = document.getElementById("friendEmail").value;
      const div = document.createElement("div");
      div.className = "user";
      div.textContent = `Friend: ${friend}`;
      document.getElementById("friendList").appendChild(div);
    }

    function createGroup() {
      const group = document.getElementById("groupName").value;
      const div = document.createElement("div");
      div.className = "group";
      div.textContent = `Group: ${group}`;
      document.getElementById("groupList").appendChild(div);
    }

    function uploadFile() {
      const file = document.getElementById("fileInput").files[0];
      const div = document.createElement("div");
      div.className = "file";
      div.textContent = `Uploaded: ${file.name}`;
      document.getElementById("fileList").appendChild(div);
    }

    function startCall() {
      alert("Call started!");
      // Placeholder for WebRTC implementation
    }
  </script>
</body>
</html>`);
});

// Profile update route
app.post("/updateProfile", express.json(), (req, res) => {
  profile = req.body;
  res.sendStatus(200);
});

// Add new post
app.post("/post", express.json(), (req, res) => {
  posts.push(req.body.post);
  res.sendStatus(200);
});

// Handle file upload
app.post("/upload", upload.single("file"), (req, res) => {
  if (req.file) {
    uploadedFiles.push(req.file.originalname);
  }
  res.redirect("/");
});

// Start server
app.listen(port, () => {
  console.log(`KeenTalk backend is running on port ${port}`);
});
