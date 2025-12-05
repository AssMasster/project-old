import React from 'react';
import Header from '../components/Header.jsx';

const AppLayout = ({ children }) => (
  <>
    <Header />
    <main className="app-content">{children}</main>
  </>
);

export default AppLayout;
