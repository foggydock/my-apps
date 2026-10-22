import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';

const root = resolve('out');
try { await stat(resolve(root, 'index.html')); }
catch { console.error('先に npm run build を実行してください。'); process.exit(1); }
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.txt': 'text/plain; charset=utf-8' };
createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405).end(); return; }
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname === '/' || pathname === '/my-apps') { res.writeHead(302, { Location: '/my-apps/' }).end(); return; }
    if (!pathname.startsWith('/my-apps/')) { res.writeHead(404).end(); return; }
    let file = resolve(root, pathname.slice('/my-apps/'.length));
    if (file !== root && !file.startsWith(root + sep)) { res.writeHead(404).end(); return; }
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch { res.writeHead(404).end(); }
}).listen(3100, '127.0.0.1', () => console.log('Preview: http://127.0.0.1:3100/my-apps/'));
