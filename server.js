const express = require('express');
const path = require('path');
const { createServer } = require('@hexlet/chat-server');

const app = express();
const PORT = process.env.PORT || 5001;

// Подключаем chat-server API
createServer(app);

// Раздаем статические файлы фронтенда
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// SPA fallback - все маршруты ведут на index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Chat API: http://localhost:${PORT}/api/v1/`);
  console.log(`✅ Frontend: http://localhost:${PORT}/`);
});