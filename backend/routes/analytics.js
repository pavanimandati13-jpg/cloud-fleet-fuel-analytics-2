const express = require('express');
const router = express.Router();
const { vehicles, fuelLogs, alerts } = require('../data/mockData');

// GET /api/analytics/summary - KPI cards data
router.get('/summary', (req, res) => {
  const totalDistance = fuelLogs.reduce((s, l) => s + l.distanceKm, 0);
  const totalFuel = fuelLogs.reduce((s, l) => s + l.fuelConsumedLtr, 0);
  const totalEnergy = fuelLogs.reduce((s, l) => s + l.energyConsumedKwh, 0);
  const totalCost = fuelLogs.reduce((s, l) => s + l.cost, 0);
  const totalCo2 = fuelLogs.reduce((s, l) => s + l.co2Kg, 0);
  const avgEfficiency =
    fuelLogs.reduce((s, l) => s + l.efficiency, 0) / (fuelLogs.length || 1);
  const activeVehicles = vehicles.filter((v) => v.status === 'Active').length;

  res.json({
    success: true,
    data: {
      totalVehicles: vehicles.length,
      activeVehicles,
      totalDistanceKm: parseFloat(totalDistance.toFixed(1)),
      totalFuelLtr: parseFloat(totalFuel.toFixed(1)),
      totalEnergyKwh: parseFloat(totalEnergy.toFixed(1)),
      totalCost: parseFloat(totalCost.toFixed(2)),
      totalCo2Kg: parseFloat(totalCo2.toFixed(1)),
      avgEfficiency: parseFloat(avgEfficiency.toFixed(2)),
    },
  });
});

// GET /api/analytics/trend?days=14 - consumption trend over time
router.get('/trend', (req, res) => {
  const days = parseInt(req.query.days) || 14;
  const grouped = {};

  fuelLogs.forEach((log) => {
    if (!grouped[log.date]) {
      grouped[log.date] = { date: log.date, fuelLtr: 0, energyKwh: 0, distanceKm: 0, cost: 0 };
    }
    grouped[log.date].fuelLtr += log.fuelConsumedLtr;
    grouped[log.date].energyKwh += log.energyConsumedKwh;
    grouped[log.date].distanceKm += log.distanceKm;
    grouped[log.date].cost += log.cost;
  });

  const series = Object.values(grouped)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-days)
    .map((d) => ({
      ...d,
      fuelLtr: parseFloat(d.fuelLtr.toFixed(1)),
      energyKwh: parseFloat(d.energyKwh.toFixed(1)),
      distanceKm: parseFloat(d.distanceKm.toFixed(1)),
      cost: parseFloat(d.cost.toFixed(2)),
    }));

  res.json({ success: true, data: series });
});

// GET /api/analytics/by-region - consumption grouped by region
router.get('/by-region', (req, res) => {
  const grouped = {};
  fuelLogs.forEach((log) => {
    if (!grouped[log.region]) {
      grouped[log.region] = { region: log.region, fuelLtr: 0, cost: 0, distanceKm: 0 };
    }
    grouped[log.region].fuelLtr += log.fuelConsumedLtr;
    grouped[log.region].cost += log.cost;
    grouped[log.region].distanceKm += log.distanceKm;
  });
  const data = Object.values(grouped).map((r) => ({
    ...r,
    fuelLtr: parseFloat(r.fuelLtr.toFixed(1)),
    cost: parseFloat(r.cost.toFixed(2)),
    distanceKm: parseFloat(r.distanceKm.toFixed(1)),
  }));
  res.json({ success: true, data });
});

// GET /api/analytics/by-vehicle-type - consumption grouped by vehicle type
router.get('/by-vehicle-type', (req, res) => {
  const typeMap = {};
  vehicles.forEach((v) => (typeMap[v.id] = v.type));

  const grouped = {};
  fuelLogs.forEach((log) => {
    const type = typeMap[log.vehicleId] || 'Unknown';
    if (!grouped[type]) grouped[type] = { type, fuelLtr: 0, count: 0 };
    grouped[type].fuelLtr += log.fuelConsumedLtr;
    grouped[type].count += 1;
  });
  const data = Object.values(grouped).map((t) => ({
    ...t,
    fuelLtr: parseFloat(t.fuelLtr.toFixed(1)),
  }));
  res.json({ success: true, data });
});

// GET /api/analytics/top-vehicles?metric=efficiency&limit=5&order=asc|desc
router.get('/top-vehicles', (req, res) => {
  const metric = req.query.metric || 'efficiency';
  const limit = parseInt(req.query.limit) || 5;
  const order = req.query.order === 'asc' ? 1 : -1;

  const perVehicle = {};
  fuelLogs.forEach((log) => {
    if (!perVehicle[log.vehicleId]) {
      perVehicle[log.vehicleId] = {
        vehicleId: log.vehicleId,
        vehicleNumber: log.vehicleNumber,
        totalFuel: 0,
        totalDistance: 0,
        totalCost: 0,
        count: 0,
        effSum: 0,
      };
    }
    const v = perVehicle[log.vehicleId];
    v.totalFuel += log.fuelConsumedLtr;
    v.totalDistance += log.distanceKm;
    v.totalCost += log.cost;
    v.effSum += log.efficiency;
    v.count += 1;
  });

  const rows = Object.values(perVehicle).map((v) => ({
    vehicleId: v.vehicleId,
    vehicleNumber: v.vehicleNumber,
    totalFuelLtr: parseFloat(v.totalFuel.toFixed(1)),
    totalDistanceKm: parseFloat(v.totalDistance.toFixed(1)),
    totalCost: parseFloat(v.totalCost.toFixed(2)),
    efficiency: parseFloat((v.effSum / v.count).toFixed(2)),
  }));

  const metricKey = metric === 'fuel' ? 'totalFuelLtr' : metric === 'cost' ? 'totalCost' : 'efficiency';
  rows.sort((a, b) => (a[metricKey] - b[metricKey]) * order);

  res.json({ success: true, data: rows.slice(0, limit) });
});

// GET /api/analytics/alerts - anomaly / maintenance alerts
router.get('/alerts', (req, res) => {
  res.json({ success: true, count: alerts.length, data: alerts });
});

module.exports = router;
