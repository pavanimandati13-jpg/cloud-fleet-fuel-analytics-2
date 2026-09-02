const { v4: uuidv4 } = require('uuid');

/**
 * In-memory data store simulating a cloud database (e.g. DynamoDB / MongoDB Atlas).
 * In a real deployment this module would be replaced by a database access layer.
 */

const VEHICLE_TYPES = ['Truck', 'Van', 'Sedan', 'SUV', 'Bus'];
const FUEL_TYPES = ['Diesel', 'Petrol', 'CNG', 'Electric'];
const REGIONS = ['North Zone', 'South Zone', 'East Zone', 'West Zone', 'Central Zone'];
const DRIVERS = [
  'Arun Kumar', 'Priya Sharma', 'Ravi Patel', 'Sneha Reddy', 'Vikram Singh',
  'Anita Desai', 'Manoj Nair', 'Kavya Iyer', 'Rahul Verma', 'Divya Menon'
];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
  return Math.floor(randomBetween(min, max + 1));
}

function generateVehicles(count = 24) {
  const vehicles = [];
  for (let i = 0; i < count; i++) {
    const type = VEHICLE_TYPES[randomInt(0, VEHICLE_TYPES.length - 1)];
    const fuelType = type === 'Sedan' && Math.random() > 0.7 ? 'Electric' : FUEL_TYPES[randomInt(0, FUEL_TYPES.length - 2)];
    vehicles.push({
      id: uuidv4(),
      vehicleNumber: `FLT-${1000 + i}`,
      type,
      fuelType,
      region: REGIONS[randomInt(0, REGIONS.length - 1)],
      driver: DRIVERS[randomInt(0, DRIVERS.length - 1)],
      odometer: randomInt(15000, 180000),
      tankCapacityLtr: fuelType === 'Electric' ? null : randomInt(45, 300),
      batteryCapacityKwh: fuelType === 'Electric' ? randomInt(60, 120) : null,
      status: Math.random() > 0.15 ? 'Active' : 'Maintenance',
      lastServiceDate: new Date(Date.now() - randomInt(1, 120) * 86400000).toISOString(),
    });
  }
  return vehicles;
}

function generateFuelLogs(vehicles, days = 30) {
  const logs = [];
  const now = Date.now();
  vehicles.forEach((vehicle) => {
    for (let d = days; d >= 0; d--) {
      // Not every vehicle logs every day
      if (Math.random() > 0.72) continue;
      const date = new Date(now - d * 86400000);
      const distanceKm = randomBetween(20, 420);
      const baseEfficiency = {
        Truck: 4.5, Van: 8.5, Sedan: 14, SUV: 10.5, Bus: 5.5,
      }[vehicle.type];
      const efficiencyVariance = randomBetween(-1.5, 1.5);
      const kmPerLtr = Math.max(2, baseEfficiency + efficiencyVariance);
      const fuelConsumedLtr = vehicle.fuelType === 'Electric'
        ? 0
        : parseFloat((distanceKm / kmPerLtr).toFixed(2));
      const energyConsumedKwh = vehicle.fuelType === 'Electric'
        ? parseFloat((distanceKm * randomBetween(0.15, 0.25)).toFixed(2))
        : 0;
      const fuelCostPerLtr = { Diesel: 92, Petrol: 105, CNG: 78 }[vehicle.fuelType] || 0;
      const cost = vehicle.fuelType === 'Electric'
        ? parseFloat((energyConsumedKwh * 8.5).toFixed(2))
        : parseFloat((fuelConsumedLtr * fuelCostPerLtr).toFixed(2));
      const idlingMinutes = randomInt(0, 90);
      const co2Kg = vehicle.fuelType === 'Electric'
        ? parseFloat((energyConsumedKwh * 0.475).toFixed(2))
        : parseFloat((fuelConsumedLtr * (vehicle.fuelType === 'Diesel' ? 2.68 : 2.31)).toFixed(2));

      logs.push({
        id: uuidv4(),
        vehicleId: vehicle.id,
        vehicleNumber: vehicle.vehicleNumber,
        region: vehicle.region,
        date: date.toISOString().split('T')[0],
        distanceKm: parseFloat(distanceKm.toFixed(1)),
        fuelConsumedLtr,
        energyConsumedKwh,
        efficiency: vehicle.fuelType === 'Electric'
          ? parseFloat((distanceKm / (energyConsumedKwh || 1)).toFixed(2))
          : parseFloat(kmPerLtr.toFixed(2)),
        cost,
        idlingMinutes,
        co2Kg,
        driver: vehicle.driver,
      });
    }
  });
  return logs.sort((a, b) => new Date(a.date) - new Date(b.date));
}

const vehicles = generateVehicles(24);
const fuelLogs = generateFuelLogs(vehicles, 30);

const alerts = [];
vehicles.forEach((v) => {
  const recentLogs = fuelLogs.filter((l) => l.vehicleId === v.id).slice(-5);
  const avgEff = recentLogs.length
    ? recentLogs.reduce((s, l) => s + l.efficiency, 0) / recentLogs.length
    : null;
  if (avgEff && avgEff < 5 && v.fuelType !== 'Electric') {
    alerts.push({
      id: uuidv4(),
      vehicleId: v.id,
      vehicleNumber: v.vehicleNumber,
      type: 'LOW_EFFICIENCY',
      severity: 'high',
      message: `${v.vehicleNumber} is showing unusually low fuel efficiency (${avgEff.toFixed(2)} km/l).`,
      createdAt: new Date().toISOString(),
    });
  }
  if (v.status === 'Maintenance') {
    alerts.push({
      id: uuidv4(),
      vehicleId: v.id,
      vehicleNumber: v.vehicleNumber,
      type: 'MAINTENANCE',
      severity: 'medium',
      message: `${v.vehicleNumber} is currently under maintenance.`,
      createdAt: new Date().toISOString(),
    });
  }
});

module.exports = { vehicles, fuelLogs, alerts };
