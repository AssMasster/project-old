import React from 'react';

export default function TestErrorComponent() {
  // Создаем ошибку как в примере Rollbar
  const triggerError = () => {
    const a = null;
    try {
      return a.hello(); 
    } catch (error) {
      throw error; 
    }
  };

  return (
    <div style={{ padding: '20px', margin: '20px 0', border: '2px solid red' }}>
      <h3>Тестовый компонент с ошибкой (как в Rollbar примере)</h3>
      <button 
        onClick={triggerError}
        style={{
          padding: '10px 20px',
          backgroundColor: '#ff4757',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Вызвать TypeError (a.hello())
      </button>
      <p style={{ fontSize: '0.9em', color: '#666', marginTop: '10px' }}>
        Эта ошибка будет перехвачена ErrorBoundary и отправлена в Rollbar
      </p>
    </div>
  );
}