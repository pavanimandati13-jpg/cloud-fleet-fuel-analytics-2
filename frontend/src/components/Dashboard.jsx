import React, { useEffect, useState } from 'react';
import StatsCards from './StatsCards';
import { TrendChart, RegionBarChart, VehicleTypePieChart } from './FuelChart';
import { getSummary, getTrend, getByRegion, getByVehicleType, getTopVehicles } from '../services/api';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);
  const [byRegion, setByRegion] = useState([]);
  const [byType, setByType] = useState([]);
  const [topEfficient, setTopEfficient] = useState([]);
  const [leastEfficient, setLeastEfficient] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [s, t, r, vt, top, bottom] = await Promise.all([
          getSummary(),
          getTrend(30),
          getByRegion(),
          getByVehicleType(),
          getTopVehicles('efficiency', 'desc', 5),
          getTopVehicles('efficiency', 'asc', 5),
        ]);
        setSummary(s);
        setTrend(t);
        setByRegion(r);
        setByType(vt);
        setTopEfficient(top);
        setLeastEfficient(bottom);
      } catch (err) {
        console.error(err);
        setError('Could not reach the analytics API. Is the backend running on port 5000?');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="loading">Loading dashboard…</div>;
  if (error) return <div className="error-banner">{error}</div>;

  return (
    <div className="dashboard">
      <StatsCards summary={summary} />

      <div className="panel">
        <div className="panel-header">
          <h2>Fuel Consumption Trend (last 30 days)</h2>
        </div>
        <TrendChart data={trend} />
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-header">
            <h2>Consumption by Region</h2>
          </div>
          <RegionBarChart data={byRegion} />
        </div>
        <div className="panel">
          <div className="panel-header">
            <h2>Consumption by Vehicle Type</h2>
          </div>
          <VehicleTypePieChart data={byType} />
        </div>
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-header">
            <h2>Top 5 Most Efficient</h2>
          </div>
          <RankTable rows={topEfficient} />
        </div>
        <div className="panel">
          <div className="panel-header">
            <h2>Top 5 Least Efficient</h2>
          </div>
          <RankTable rows={leastEfficient} warn />
        </div>
      </div>
    </div>
  );
}

function RankTable({ rows, warn }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Vehicle #</th>
            <th>Efficiency (km/l)</th>
            <th>Fuel (L)</th>
            <th>Cost (₹)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.vehicleId}>
              <td className="mono">{r.vehicleNumber}</td>
              <td className={warn ? 'text-red' : 'text-green'}>{r.efficiency}</td>
              <td>{r.totalFuelLtr}</td>
              <td>{r.totalCost.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
