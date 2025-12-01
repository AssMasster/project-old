const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

// 1. Вариант: Просто импортируем chat-server (он запустится сам)
require('@hexlet/chat-server');

// 2. Вариант: Если нужно интегрировать с Express
// app.use('/api', require('@hexlet/chat-server'));

// 3. Вариант: Создаем свои эндпоинты если chat-server не работает
app.use(express.json());

// Тестовые эндпоинты
app.get('/api/v1/test', (req, res) => {
  res.json({ status: 'ok', message: 'API работает' });
});

app.post('/api/v1/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    res.json({ 
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjk4NzY0MDAwfQ.abcdef123456' 
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/v1/channels', (req, res) => {
  res.json([
    { id: 1, name: 'general', removable: false },
    { id: 2, name: 'random', removable: true },
  ]);
});

app.get('/api/v1/messages', (req, res) => {
  res.json([
    { id: 1, channelId: 1, username: 'admin', body: 'Добро пожаловать в чат!', createdAt: new Date() },
  ]);
});

// Статика фронтенда
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// SPA роутинг
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на порту ${PORT}`);
  console.log(`✅ Chat API: http://localhost:${PORT}/api/v1/`);
  console.log(`✅ Фронтенд: http://localhost:${PORT}/`);
});