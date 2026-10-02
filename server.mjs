import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 4173;
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.gltf': 'model/gltf+json',
  '.glb': 'model/gltf-binary',
  '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.bin': 'application/octet-stream',
  '.ogg': 'audio/ogg', '.mp3': 'audio/mpeg', '.wav': 'audio/wav',
  '.txt': 'text/plain; charset=utf-8', '.md': 'text/markdown; charset=utf-8',
};

// v46: suporte a HTTP Range (206). Safari/iOS exige Range para tocar áudio/vídeo,
// e o Chromium aborta e reabre a requisição quando o servidor não o suporta.
const server = http.createServer((req, res) => {
  let p;
  try {
    const name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    p = path.resolve(root, '.' + (name === '/' ? '/index.html' : name));
    if (!p.startsWith(root + path.sep)) throw Error('path');
  } catch { res.writeHead(400); res.end('Bad request'); return; }

  fs.stat(p, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404); res.end('Not found'); return; }
    const headers = {
      'Content-Type': mime[path.extname(p).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
      'Accept-Ranges': 'bytes',
    };
    const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
    if (range && (range[1] || range[2])) {
      const start = range[1] === '' ? Math.max(0, st.size - Number(range[2])) : Number(range[1]);
      const end = range[1] === '' || range[2] === '' ? st.size - 1 : Math.min(Number(range[2]), st.size - 1);
      if (start > end || start >= st.size) {
        res.writeHead(416, {'Content-Range': `bytes */${st.size}`}); res.end(); return;
      }
      res.writeHead(206, {...headers, 'Content-Range': `bytes ${start}-${end}/${st.size}`, 'Content-Length': end - start + 1});
      if (req.method === 'HEAD') { res.end(); return; }
      fs.createReadStream(p, {start, end}).on('error', () => res.destroy()).pipe(res);
      return;
    }
    res.writeHead(200, {...headers, 'Content-Length': st.size});
    if (req.method === 'HEAD') { res.end(); return; }
    fs.createReadStream(p).on('error', () => res.destroy()).pipe(res);
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Porta ${PORT} em uso. Feche o outro servidor ou rode INICIAR.bat de novo.`);
    process.exit(1);
  }
  throw err;
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Halloween Rosa — Lelinha: http://localhost:${PORT}`);
});
