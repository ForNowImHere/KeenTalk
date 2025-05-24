const http = require('http');

const PORT = process.env.PORT || 3000;

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>KeenTalk</title>
  <style>
    body {
      background-color: black;
      color: white;
      font-family: sans-serif;
      text-align: center;
      padding-top: 100px;
    }
  </style>
</head>
<body>
  <h1>🌑 KeenTalk Server is ALIVE</h1>
  <p>You made it. HTML is working.</p>
</body>
</html>
`;

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(htmlContent);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`🌑 KeenTalk running at http://localhost:${PORT}`);
});
