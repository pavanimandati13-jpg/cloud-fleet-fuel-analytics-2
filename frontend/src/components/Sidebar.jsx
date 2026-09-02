import React from 'react';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: '📊' },
  { key: 'vehicles', label: 'Vehicles', icon: '🚚' },
  { key: 'alerts', label: 'Alerts', icon: '⚠️' },
];

export default function Sidebar({ active, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-icon">⛽</span>
        <div>
          <div className="sidebar-brand-title">FleetFuel</div>
          <div className="sidebar-brand-subtitle">Cloud Analytics</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`sidebar-nav-item ${active === item.key ? 'active' : ''}`}
            onClick={() => onNavigate(item.key)}
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <p>Connected to cloud API</p>
        <span className="status-dot" /> Live
      </div>
    </aside>
  );
}
