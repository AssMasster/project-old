import React from 'react';
import { useRollbar } from '@rollbar/react';

export default function RollbarTestPanel() {
  const rollbar = useRollbar();

  const testCases = [
    {
      name: 'Тест 1: Uncaught Error',
      action: () => {
        // Необработанная ошибка
        throw new Error('Uncaught test error from Hexlet Chat project');
      }
    },
    {
      name: 'Тест 2: Log Error',
      action: () => {
        // Логируем ошибку через Rollbar
        try {
          throw new Error('Logged error test');
        } catch (error) {
          rollbar.error('Manual error logging test', error);
          alert('✅ Ошибка залогирована в Rollbar!');
        }
      }
    },
    {
      name: 'Тест 3: Warning',
      action: () => {
        rollbar.warning('Пользователь сделал необычное действие', {
          userId: 'test_user',
          action: 'test_button_click',
          project: 'hexlet-chat'
        });
        alert('⚠️ Предупреждение отправлено!');
      }
    },
    {
      name: 'Тест 4: Info Message',
      action: () => {
        rollbar.info('Пользователь тестирует Rollbar интеграцию', {
          stage: 11,
          timestamp: new Date().toISOString()
        });
        alert('ℹ️ Информационное сообщение отправлено!');
      }
    },
    {
      name: 'Тест 5: Critical Error',
      action: () => {
        rollbar.critical('Критическая ошибка в работе приложения', {
          component: 'chat-widget',
          userCount: 0,
          environment: import.meta.env.MODE
        });
        alert('🚨 Критическая ошибка отправлена!');
      }
    }
  ];

  return (
    <div style={{
      maxWidth: '800px',
      margin: '2rem auto',
      padding: '2rem',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f8f9fa'
    }}>
      <h2 style={{ color: '#2d3436', marginBottom: '1.5rem' }}>
        🐞 Rollbar Integration Tests - Этап 11
      </h2>
      
      <div style={{
        backgroundColor: '#0984e3',
        color: 'white',
        padding: '1rem',
        borderRadius: '6px',
        marginBottom: '1.5rem'
      }}>
        <h3>Информация о конфигурации</h3>
        <p><strong>Токен:</strong> {import.meta.env.VITE_ROLLBAR_TOKEN ? '✅ Настроен' : '❌ Не настроен'}</p>
        <p><strong>Окружение:</strong> {import.meta.env.MODE}</p>
        <p><strong>Проект:</strong> Hexlet Chat Frontend</p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h3>Тесты по документации Rollbar:</h3>
        {testCases.map((test, index) => (
          <div key={index} style={{
            marginBottom: '0.5rem',
            padding: '0.75rem',
            border: '1px solid #dfe6e9',
            borderRadius: '4px'
          }}>
            <button
              onClick={test.action}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#00b894',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '1rem'
              }}
            >
              {test.name}
            </button>
            <small style={{ color: '#636e72' }}>
              {test.name.includes('Uncaught') ? 'Будет перехвачено ErrorBoundary' : 'Отправляется напрямую'}
            </small>
          </div>
        ))}
      </div>

      <div style={{
        padding: '1rem',
        backgroundColor: '#fff9e6',
        border: '1px dashed #fdcb6e',
        borderRadius: '6px'
      }}>
        <h4>📋 Проверка выполнения задания:</h4>
        <ol>
          <li>✅ Создан аккаунт Rollbar</li>
          <li>✅ Получен client-side access token</li>
          <li>✅ Установлен @rollbar/react</li>
          <li>✅ Настроен Provider и ErrorBoundary</li>
          <li>🔄 Тестирование отправки ошибок</li>
          <li>🔄 Деплой на продакшен</li>
          <li>🔄 Проверка в Rollbar Dashboard</li>
        </ol>
      </div>
    </div>
  );
}