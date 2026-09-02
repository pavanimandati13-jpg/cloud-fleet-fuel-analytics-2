import React, { useEffect, useState } from 'react';
import { getVehicles, getRegions } from '../services/api';

export default function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [regions, setRegions] = useState([]);
  const [filters, setFilters] = useState({ region: '', status: '', search: '' });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [vList, rList] = await Promise.all([getVehicles(filters), getRegions()]);
      setVehicles(vList);
      setRegions(rList);
    } catch (err) {
      console.error('Failed to load vehicles', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.region, filters.status]);

  const handleSearch = (e) => {
    e.preventDefault();
    load();
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Fleet Vehicles</h2>
        <form className="filter-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search vehicle or driver..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <select
            value={filters.region}
            onChange={(e) => setFilters({ ...filters, region: e.target.value })}
          >
            <option value="">All Regions</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Maintenance">Maintenance</option>
          </select>
          <button type="submit">Search</button>
        </form>
      </div>

      {loading ? (
        <div className="loading">Loading vehicles…</div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Vehicle #</th>
                <th>Type</th>
                <th>Fuel</th>
                <th>Region</th>
                <th>Driver</th>
                <th>Odometer</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id}>
                  <td className="mono">{v.vehicleNumber}</td>
                  <td>{v.type}</td>
                  <td>{v.fuelType}</td>
                  <td>{v.region}</td>
                  <td>{v.driver}</td>
                  <td>{v.odometer.toLocaleString()} km</td>
                  <td>
                    <span className={`badge ${v.status === 'Active' ? 'badge-green' : 'badge-amber'}`}>
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
              {vehicles.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-row">
                    No vehicles match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
