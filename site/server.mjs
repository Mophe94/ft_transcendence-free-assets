import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('./dist/', import.meta.url));
const port = process.env.PORT || 3000;

const contentTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    let path = normalize(url.pathname);

    if (path === '/') {
      path = '/index.html';
    }

    const file = join(root, path);

    try {
      await readFile(file);

      res.writeHead(200, {
        'Content-Type':
          contentTypes[extname(file)] || 'application/octet-stream',
      });

      createReadStream(file).pipe(res);
    } catch {
      // SPA fallback
      const index = join(root, 'index.html');

      res.writeHead(200, {
        'Content-Type': 'text/html',
      });

      createReadStream(index).pipe(res);
    }
  } catch {
    res.writeHead(500);
    res.end('Internal Server Error');
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Frontend listening on ${port}`);
});
