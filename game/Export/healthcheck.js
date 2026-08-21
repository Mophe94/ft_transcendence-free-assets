import http from 'http';

const port = process.env.GAME_PORT || 8060;

const req = http.get(`http://localhost:${port}/health`, (res) => {
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

req.on('error', () => {
  process.exit(1);
});