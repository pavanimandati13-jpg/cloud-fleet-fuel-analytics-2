const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const { vehicles, fuelLogs } = require('../data/mockData');

// GET /api/fleet/vehicles - list all vehicles (supports filtering)
router.get('/vehicles', (req, res) => {
  const { region, status, fuelType, search } = req.query;
  let result = [...vehicles];

  if (region) result = result.filter((v) => v.region === region);
  if (status) result = result.filter((v) => v.status === status);
  if (fuelType) result = result.filter((v) => v.fuelType === fuelType);
  if (search) {
    const s = search.toLowerCase();
    result = result.filter(
      (v) => v.vehicleNumber.toLowerCase().includes(s) || v.driver.toLowerCase().includes(s)
    );
  }

  res.json({ success: true, count: result.length, data: result });
});

// GET /api/fleet/vehicles/:id - single vehicle detail
router.get('/vehicles/:id', (req, res) => {
  const vehicle = vehicles.find((v) => v.id === req.params.id);
  if (!vehicle) {
    return res.status(404).json({ success: false, message: 'Vehicle not found' });
  }
  const logs = fuelLogs.filter((l) => l.vehicleId === vehicle.id);
  res.json({ success: true, data: { ...vehicle, logs } });
});

// POST /api/fleet/vehicles - register a new vehicle
router.post('/vehicles', (req, res) => {
  const { vehicleNumber, type, fuelType, region, driver, tankCapacityLtr, batteryCapacityKwh } = req.body;

  if (!vehicleNumber || !type || !fuelType || !region) {
    return res.status(400).json({
      success: false,
      message: 'vehicleNumber, type, fuelType and region are required',
    });
  }

  const newVehicle = {
    id: uuidv4(),
    vehicleNumber,
    type,
    fuelType,
    region,
    driver: driver || 'Unassigned',
    odometer: 0,
    tankCapacityLtr: tankCapacityLtr || null,
    batteryCapacityKwh: batteryCapacityKwh || null,
    status: 'Active',
    lastServiceDate: new Date().toISOString(),
  };

  vehicles.push(newVehicle);
  res.status(201).json({ success: true, data: newVehicle });
});

// PUT /api/fleet/vehicles/:id - update a vehicle
router.put('/vehicles/:id', (req, res) => {
  const index = vehicles.findIndex((v) => v.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Vehicle not found' });
  }
  vehicles[index] = { ...vehicles[index], ...req.body, id: vehicles[index].id };
  res.json({ success: true, data: vehicles[index] });
});

// DELETE /api/fleet/vehicles/:id
router.delete('/vehicles/:id', (req, res) => {
  const index = vehicles.findIndex((v) => v.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Vehicle not found' });
  }
  const removed = vehicles.splice(index, 1);
  res.json({ success: true, data: removed[0] });
});

// GET /api/fleet/regions - distinct regions
router.get('/regions', (req, res) => {
  res.json({ success: true, data: [...new Set(vehicles.map((v) => v.region))] });
});

module.exports = router;
