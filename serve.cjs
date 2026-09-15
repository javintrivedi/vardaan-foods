const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

const server = http.createServer((req, res) => {
  // Remove query strings
  let urlPath = req.url.split('?')[0];
  
  // Default to index.html
  if (urlPath === '/') urlPath = '/index.html';
  
  // Try file in root first, then public/
  let filePath = path.join(ROOT, urlPath);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(ROOT, 'public', urlPath);
  }
  
  // Try adding .html
  if (!fs.existsSync(filePath) && !path.extname(urlPath)) {
    filePath = path.join(ROOT, urlPath + '.html');
  }
  
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404);
    res.end('Not found: ' + urlPath);
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME[ext] || 'application/octet-stream';

  res.writeHead(200, {
    'Content-Type': mime,
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
  });

  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`\n  Static server running at http://localhost:${PORT}/\n`);
});
