import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../docs/', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.zip': 'application/zip' };
createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://127.0.0.1');
    const pathname = decodeURIComponent(url.pathname);
    const path = resolve(root, '.' + pathname + (pathname.endsWith('/') ? 'index.html' : ''));
    if (!path.startsWith(resolve(root) + sep)) { res.writeHead(403); res.end(); return; }
    const data = await readFile(path);
    res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream' });
    res.end(data);
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(8000, '127.0.0.1', () => console.log('TextHeadGlyph: http://127.0.0.1:8000/ (Ctrl+C to stop)'));
