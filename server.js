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
      <title>Sprunki Upload</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f0f0f0; padding: 2rem; }
        form { background: white; padding: 2rem; border-radius: 8px; max-width: 400px; margin: auto; }
        input[type="file"] { margin-bottom: 1rem; }
        button { background: #007BFF; color: white; padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #0056b3; }
        .message { margin-top: 1rem; font-weight: bold; }
      </style>
    </head>
    <body>
      <h1>Sprunki File Upload</h1>
      <form action="/upload" method="post" enctype="multipart/form-data">
        <input type="file" name="file" required />
        <br />
        <button type="submit">Upload</button>
      </form>
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
