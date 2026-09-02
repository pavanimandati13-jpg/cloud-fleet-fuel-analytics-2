import React, { useEffect, useState } from 'react';
import { getAlerts } from '../services/api';

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAlerts()
      .then(setAlerts)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Alerts & Anomalies</h2>
      </div>
      {loading ? (
        <div className="loading">Loading alerts…</div>
      ) : alerts.length === 0 ? (
        <p className="empty-row">No active alerts. Fleet is operating normally.</p>
      ) : (
        <ul className="alert-list">
          {alerts.map((a) => (
            <li key={a.id} className={`alert-item severity-${a.severity}`}>
              <span className="alert-badge">{a.type.replace('_', ' ')}</span>
              <div>
                <p className="alert-message">{a.message}</p>
                <span className="alert-time">{new Date(a.createdAt).toLocaleString()}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
