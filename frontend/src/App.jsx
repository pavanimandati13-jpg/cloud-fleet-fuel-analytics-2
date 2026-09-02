import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import VehicleList from './components/VehicleList';
import AlertsPanel from './components/AlertsPanel';
import './App.css';

export default function App() {
  const [view, setView] = useState('dashboard');

  return (
    <div className="app-shell">
      <Sidebar active={view} onNavigate={setView} />
      <main className="main-content">
        <header className="topbar">
          <h1>Cloud-Based Fleet Fuel Consumption Analytics</h1>
          <p>Real-time visibility into fuel usage, cost and efficiency across your fleet</p>
        </header>
        {view === 'dashboard' && <Dashboard />}
        {view === 'vehicles' && <VehicleList />}
        {view === 'alerts' && <AlertsPanel />}
      </main>
    </div>
  );
}
