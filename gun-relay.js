// VYNRYX GunDB Relay Server (OPSIYONEL!)
// 
// ⚠️ Bu server OPSIYONEL'dir!
// Platform public community relay'leri kullanır.
// Bu sadece kendi relay'ini çalıştırmak istersen.
//
// Kullanım: npm run relay

const Gun = require('gun');
const http = require('http');

// HTTP sunucusu oluştur
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('VYNRYX GunDB Relay Server is running!\n');
});

// GunDB relay'i bağla
Gun({ web: server });

// Port
const PORT = 8765;

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║  🚀 VYNRYX GunDB Relay Server             ║
║                                            ║
║  Port: ${PORT}                                ║
║  URL:  http://localhost:${PORT}/gun         ║
║                                            ║
║  Status: ✅ Running                        ║
║  Purpose: P2P data synchronization        ║
╚════════════════════════════════════════════╝
  `);
});

// Hata yakalama
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} already in use!`);
    console.log('Try: pkill -f gun-relay');
  } else {
    console.error('❌ Server error:', err);
  }
});

// Temiz kapanış
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down relay server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
