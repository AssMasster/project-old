import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routes } from './routesConfig.jsx';
import ToastNotifications from './components/ui/ToastNotifications.jsx';
import useSocket from '../hooks/useSocket.js';
import ModalRoot from './features/ui/ModalRoot.jsx';

const App = () => {
  useSocket();

  return (
    <Router>
      <ToastNotifications />
      <Routes>
        {routes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
      <ModalRoot />
    </Router>
  );
};

export default App;
