import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use(express.static(__dirname));

const PORT = process.env.GAME_PORT || 8060;
app.listen(PORT, () => {
  console.log(`🎮 Game Server ready on: http://localhost:${PORT}/Export.html`);
});
