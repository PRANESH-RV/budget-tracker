'use strict';
// Tiny local server: serves budgetly.html and the /api/ai proxy (no dependencies).
// Run with:  npm run dev   (needs Node 20.6+ and a .env file)
const http = require('http');
const fs = require('fs');
const path = require('path');
const handler = require('./api/ai.js');

const PORT = Number(process.env.PORT || 3000);

http
  .createServer((req, res) => {
    const url = (req.url || '/').split('?')[0];
    if (url === '/api/ai') return handler(req, res);
    if (url === '/' || url === '/budgetly.html') {
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'no-referrer',
      });
      return fs.createReadStream(path.join(__dirname, 'budgetly.html')).pipe(res);
    }
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  })
  .listen(PORT, () => {
    console.log(`Budgetly running at http://localhost:${PORT}`);
    console.log(process.env.ANTHROPIC_API_KEY ? 'AI: key loaded' : 'AI: no ANTHROPIC_API_KEY set (app runs in basic mode)');
  });
