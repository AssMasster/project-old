const express = require('express');
const path = require('path');
const { createServer } = require('@hexlet/chat-server');

const app = express();
const PORT = process.env.PORT || 5001;

// ВСЁ API и WebSocket
createServer(app);

// Статика фронтенда
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// SPA роутинг
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на порту ${PORT}`);
  console.log(`✅ API: http://localhost:${PORT}/api/v1/`);
  console.log(`✅ Фронтенд: http://localhost:${PORT}/`);
});