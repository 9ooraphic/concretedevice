// 같은 Wi-Fi의 휴대폰에서 보기 위한 간단한 정적 서버
// 실행: node serve.js  →  터미널에 나오는 주소를 폰에서 열기
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = process.env.PORT || 3001;
const ROOT = __dirname;
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.js': 'text/javascript',
  '.css': 'text/css',
};

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(ROOT, p);
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, {
      'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store',   // 수정하면 새로고침만으로 바로 반영
    });
    res.end(data);
  });
}).listen(PORT, '0.0.0.0', () => {
  console.log(`\n  이 컴퓨터:  http://localhost:${PORT}`);
  for (const list of Object.values(os.networkInterfaces())) {
    for (const a of list) {
      if (a.family === 'IPv4' && !a.internal) console.log(`  휴대폰:     http://${a.address}:${PORT}`);
    }
  }
  console.log('');
});
