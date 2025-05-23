const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve the HTML directly as a string
const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sprunki Sinner Mods</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
      color: #000;
      transition: background-color 0.3s, color 0.3s;
    }
    body.dark-mode {
      background-color: #333;
      color: #fff;
    }
    .container {
      width: 80%;
      margin: auto;
      padding: 20px;
      background: #fff;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    }
    body.dark-mode .container {
      background: #444;
      color: #fff;
    }
    .profile, .post {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }
    .profile img, .post img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
    textarea, input, button {
      margin: 5px 0;
      padding: 10px;
      border-radius: 5px;
    }
    button {
      background: #007bff;
      color: white;
      cursor: pointer;
      border: none;
    }
    button:hover {
      background: #0056b3;
    }
  </style>
</head>
<body>
  <div class="container">
    <div style="text-align: right">
      <button id="toggleDarkMode">Toggle Dark Mode</button>
    </div>
    <h1>Sprunki Sinner Mods</h1>

    <div id="profileSection">
      <div class="profile">
        <img id="profilePicture" src="" alt="Profile Picture" />
        <div>
          <h3 id="profileName">User Name</h3>
          <p id="profileBio">This is your bio. Add something cool!</p>
          <button id="editProfileButton">Edit Profile</button>
        </div>
      </div>
      <div id="profileEditor" style="display: none">
        <input type="file" id="profilePictureInput" accept="image/*" />
        <input type="text" id="profileNameInput" placeholder="Enter your name" />
        <textarea id="profileBioInput" placeholder="Enter your bio"></textarea>
        <button id="saveProfileButton">Save Profile</button>
      </div>
    </div>

    <h2>What's on your mind?</h2>
    <textarea id="newPostInput" placeholder="Write something..."></textarea>
    <button id="postButton">Post</button>
    <div id="posts"></div>

    <h2>Upload Files</h2>
    <input type="file" id="fileInput" accept=".html,.sb3,.png,.jpg,.mp4" />
    <button id="uploadFileButton">Upload</button>
    <div id="fileList"></div>

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
    document.getElementById('toggleDarkMode').onclick = () => {
      document.body.classList.toggle('dark-mode');
    };

    // Dummy front-end logic placeholders
    document.getElementById('editProfileButton').onclick = () => {
      document.getElementById('profileEditor').style.display = 'block';
    };
    document.getElementById('saveProfileButton').onclick = () => {
      const name = document.getElementById('profileNameInput').value;
      const bio = document.getElementById('profileBioInput').value;
      document.getElementById('profileName').textContent = name;
      document.getElementById('profileBio').textContent = bio;
      document.getElementById('profileEditor').style.display = 'none';
    };
  </script>
</body>
</html>
`;

app.get('/', (req, res) => {
  res.send(html);
});

app.listen(PORT, () => {
  console.log(`✅ Sprunki is live at http://localhost:${PORT}`);
});
