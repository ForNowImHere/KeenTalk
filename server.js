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
    body { font-family: Arial, sans-serif; background: #f5f5f5; color: #000; margin: 0; padding: 0; transition: all 0.3s; }
    body.dark-mode { background: #333; color: #fff; }
    .container { width: 80%; margin: auto; padding: 20px; background: #fff; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
    body.dark-mode .container { background: #444; }
    .profile, .post { display: flex; gap: 10px; margin-bottom: 10px; align-items: center; }
    .profile img, .post img { width: 50px; height: 50px; border-radius: 50%; }
    input, textarea, button { padding: 10px; margin: 5px 0; border-radius: 5px; border: 1px solid #ccc; }
    button { background: #007bff; color: #fff; border: none; cursor: pointer; }
    button:hover { background: #0056b3; }
  </style>
</head>
<body>
  <div class="container">
    <div style="text-align:right"><button id="toggleDarkMode">Toggle Dark Mode</button></div>
    <h1>Sprunki Sinner Mods</h1>
    
    <div id="profileSection">
      <div class="profile">
        <img id="profilePicture" src="${profile.picture || ""}" alt="Profile Picture" />
        <div>
          <h3 id="profileName">${profile.name}</h3>
          <p id="profileBio">${profile.bio}</p>
          <button id="editProfileButton">Edit Profile</button>
        </div>
      </div>
      <div id="profileEditor" style="display:none">
        <input type="file" id="profilePictureInput" accept="image/*" />
        <input type="text" id="profileNameInput" placeholder="Enter your name" />
        <textarea id="profileBioInput" placeholder="Enter your bio"></textarea>
        <button id="saveProfileButton">Save Profile</button>
      </div>
    </div>

    <h2>What's on your mind?</h2>
    <textarea id="newPostInput" placeholder="Write something..."></textarea>
    <button id="postButton">Post</button>
    <div id="posts">${posts.map(p => `<div class="post"><strong>${p}</strong></div>`).join('')}</div>

    <h2>Upload Files</h2>
    <form id="uploadForm" enctype="multipart/form-data" method="POST" action="/upload">
      <input type="file" name="file" />
      <button type="submit">Upload</button>
    </form>
    <ul>${uploadedFiles.map(f => `<li>${f}</li>`).join('')}</ul>

    <h2>Friends</h2>
    <input type="text" id="friendNameInput" placeholder="Friend's name" />
    <button id="addFriendButton">Add Friend</button>
    <ul id="friendList"></ul>

    <h2>Calls</h2>
    <input type="text" id="callUserInput" placeholder="User to call" />
    <button id="startCallButton">Start Call</button>
    <video id="localVideo" autoplay muted></video>
    <video id="remoteVideo" autoplay></video>
  </div>

  <script>
    document.getElementById("toggleDarkMode").onclick = () => document.body.classList.toggle("dark-mode");

    document.getElementById("editProfileButton").onclick = () => {
      document.getElementById("profileEditor").style.display = "block";
    };

    document.getElementById("saveProfileButton").onclick = async () => {
      const name = document.getElementById("profileNameInput").value;
      const bio = document.getElementById("profileBioInput").value;
      const pic = document.getElementById("profilePictureInput").files[0];
      const reader = new FileReader();
      reader.onload = () => {
        fetch('/updateProfile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, bio, picture: reader.result })
        }).then(() => location.reload());
      };
      if (pic) reader.readAsDataURL(pic);
      else reader.onload();
    };

    document.getElementById("postButton").onclick = () => {
      const post = document.getElementById("newPostInput").value;
      fetch('/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post })
      }).then(() => location.reload());
    };
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
