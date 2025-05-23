const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

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
      background-color: #222;
      color: #eee;
    }
    .container {
      max-width: 800px;
      margin: auto;
      padding: 20px;
    }
    button {
      background: #007bff;
      color: white;
      border: none;
      padding: 10px;
      border-radius: 5px;
      cursor: pointer;
    }
    button:hover {
      background: #0056b3;
    }
    input, textarea {
      width: 100%;
      margin: 5px 0;
      padding: 10px;
      border-radius: 4px;
      border: 1px solid #ccc;
    }
    .post, .profile {
      margin-top: 10px;
      padding: 10px;
      background: #fff;
      border-radius: 5px;
    }
    body.dark-mode .post, body.dark-mode .profile {
      background: #333;
    }
  </style>
</head>
<body>
  <div class="container">
    <button onclick="document.body.classList.toggle('dark-mode')">Toggle Dark Mode</button>
    <h1>Sprunki Sinner Mods</h1>

    <div class="profile">
      <h2 id="profileName">User Name</h2>
      <p id="profileBio">This is your bio.</p>
      <input id="profileNameInput" placeholder="Enter your name" />
      <textarea id="profileBioInput" placeholder="Enter your bio..."></textarea>
      <button onclick="updateProfile()">Save Profile</button>
    </div>

    <div class="post-area">
      <h2>Create Post</h2>
      <textarea id="newPostInput" placeholder="Write something..."></textarea>
      <button onclick="createPost()">Post</button>
      <div id="posts"></div>
    </div>
  </div>

  <script>
    function updateProfile() {
      const name = document.getElementById('profileNameInput').value;
      const bio = document.getElementById('profileBioInput').value;
      document.getElementById('profileName').textContent = name;
      document.getElementById('profileBio').textContent = bio;
    }

    function createPost() {
      const content = document.getElementById('newPostInput').value;
      if (!content.trim()) return;
      const postDiv = document.createElement('div');
      postDiv.className = 'post';
      postDiv.textContent = content;
      document.getElementById('posts').prepend(postDiv);
      document.getElementById('newPostInput').value = '';
    }
  </script>
</body>
</html>
`;

app.get('/', (req, res) => {
  res.send(html);
});

app.listen(PORT, () => {
  console.log(\`✅ Sprunki Sinner Mods is live at http://localhost:\${PORT}\`);
});
