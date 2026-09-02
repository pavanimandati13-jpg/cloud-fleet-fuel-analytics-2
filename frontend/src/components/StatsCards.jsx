import React from 'react';

function Card({ icon, label, value, suffix, accent }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${accent}`}>{icon}</div>
      <div>
        <div className="stat-value">
          {value}
          {suffix && <span className="stat-suffix">{suffix}</span>}
        </div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

export default function StatsCards({ summary }) {
  if (!summary) return null;
  return (
    <div className="stats-grid">
      <Card icon="🚛" label="Total Vehicles" value={summary.totalVehicles} accent="blue" />
      <Card icon="✅" label="Active Vehicles" value={summary.activeVehicles} accent="green" />
      <Card icon="🛣️" label="Total Distance" value={summary.totalDistanceKm.toLocaleString()} suffix=" km" accent="purple" />
      <Card icon="⛽" label="Fuel Consumed" value={summary.totalFuelLtr.toLocaleString()} suffix=" L" accent="amber" />
      <Card icon="💰" label="Total Fuel Cost" value={`₹${summary.totalCost.toLocaleString()}`} accent="red" />
      <Card icon="🌱" label="CO₂ Emitted" value={summary.totalCo2Kg.toLocaleString()} suffix=" kg" accent="teal" />
      <Card icon="📈" label="Avg Efficiency" value={summary.avgEfficiency} suffix=" km/l" accent="indigo" />
    </div>
  );
}
