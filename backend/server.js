require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

const fleetRoutes = require('./routes/fleet');
const analyticsRoutes = require('./routes/analytics');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Global middleware ---
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Health check (useful for cloud load balancers / uptime checks) ---
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    service: 'fleet-fuel-analytics-backend',
    status: 'healthy',
    uptimeSeconds: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// --- API routes ---
app.use('/api/fleet', fleetRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Cloud Fleet Fuel Consumption Analytics API',
    endpoints: [
      'GET  /api/health',
      'GET  /api/fleet/vehicles',
      'GET  /api/fleet/vehicles/:id',
      'POST /api/fleet/vehicles',
      'PUT  /api/fleet/vehicles/:id',
      'DELETE /api/fleet/vehicles/:id',
      'GET  /api/fleet/regions',
      'GET  /api/analytics/summary',
      'GET  /api/analytics/trend',
      'GET  /api/analytics/by-region',
      'GET  /api/analytics/by-vehicle-type',
      'GET  /api/analytics/top-vehicles',
      'GET  /api/analytics/alerts',
    ],
  });
});

// --- 404 + error handling ---
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Fleet Fuel Analytics API running on http://localhost:${PORT}`);
});

module.exports = app;
