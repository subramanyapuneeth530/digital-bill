import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Menu from './pages/Menu';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Navigate to="/table/1" replace />} />
        <Route path="/table/:tableId" element={<Menu />} />
        <Route path="/staff" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
