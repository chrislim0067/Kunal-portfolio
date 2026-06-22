/**
 * Static file server for the mirrored production build.
 * Serves existing files directly; falls back to index.html for SPA routes.
 */
const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');
const os = require('os');

const ROOT = path.resolve(__dirname, '..');
const PORT = process.env.PORT || 4200;
const HOST = process.env.HOST || '0.0.0.0';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.bin': 'application/octet-stream',
  '.gltf': 'model/gltf+json',
  '.obj': 'text/plain',
  '.mtl': 'text/plain',
  '.fbx': 'application/octet-stream',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.xml': 'application/xml',
};

function send(res, status, body, type) {
  res.writeHead(status, {
    'Content-Type': type || 'text/plain',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(body);
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url);
  let pathname = decodeURIComponent(parsed.pathname);

  if (pathname === '/') pathname = '/index.html';

  const filePath = path.resolve(ROOT, pathname.replace(/^\//, ''));

  // Prevent path traversal (case-insensitive on Windows)
  const rootLower = ROOT.toLowerCase();
  if (!filePath.toLowerCase().startsWith(rootLower)) {
    return send(res, 403, 'Forbidden');
  }

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const stream = fs.createReadStream(filePath);
      res.writeHead(200, {
        'Content-Type': MIME[ext] || 'application/octet-stream',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Access-Control-Allow-Origin': '*',
      });
      return stream.pipe(res);
    }

    // SPA fallback
    const indexPath = path.join(ROOT, 'index.html');
    fs.readFile(indexPath, (readErr, data) => {
      if (readErr) return send(res, 404, 'Not found');
      send(res, 200, data, MIME['.html']);
    });
  });
});

server.listen(PORT, HOST, () => {
  const lan = Object.values(os.networkInterfaces())
    .flat()
    .filter((n) => n && n.family === 'IPv4' && !n.internal)
    .map((n) => n.address);

  console.log('');
  console.log('  Logartis local mirror');
  console.log(`  http://localhost:${PORT}`);
  lan.forEach((ip) => console.log(`  http://${ip}:${PORT}`));
  console.log('');
  console.log(`  Serving: ${ROOT}`);
  console.log('  Press Ctrl+C to stop');
  console.log('');
});
