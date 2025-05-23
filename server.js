const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// This will serve actual HTML to your browser
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>KeenTalk</title>
        <style>
          body {
            background-color: #111;
            color: #0f0;
            font-family: monospace;
            text-align: center;
            padding-top: 20vh;
          }
          h1 {
            font-size: 3em;
          }
        </style>
      </head>
      <body>
        <h1>Welcome to KeenTalk</h1>
        <p>Your single-file app is alive and talking.</p>
      </body>
    </html>
  `);
});

// THIS message is for the terminal — not the browser
app.listen(PORT, () => {
  console.log("KeenTalk backend is running on port " + PORT);
});
