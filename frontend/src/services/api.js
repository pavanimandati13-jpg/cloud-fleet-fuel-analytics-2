import axios from 'axios';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    'https://cloud-fleet-fuel-analytics-2.onrender.com/api',
  timeout: 10000,
});

export const getSummary = () =>
  api.get('/analytics/summary').then((r) => r.data.data);

export const getTrend = (days = 14) =>
  api.get(`/analytics/trend?days=${days}`).then((r) => r.data.data);

export const getByRegion = () =>
  api.get('/analytics/by-region').then((r) => r.data.data);

export const getByVehicleType = () =>
  api.get('/analytics/by-vehicle-type').then((r) => r.data.data);

export const getTopVehicles = (
  metric = 'efficiency',
  order = 'desc',
  limit = 5
) =>
  api
    .get(
      `/analytics/top-vehicles?metric=${metric}&order=${order}&limit=${limit}`
    )
    .then((r) => r.data.data);

export const getAlerts = () =>
  api.get('/analytics/alerts').then((r) => r.data.data);

export const getVehicles = (params = {}) =>
  api.get('/fleet/vehicles', { params }).then((r) => r.data.data);

export const getVehicle = (id) =>
  api.get(`/fleet/vehicles/${id}`).then((r) => r.data.data);

export const createVehicle = (payload) =>
  api.post('/fleet/vehicles', payload).then((r) => r.data.data);

export const updateVehicle = (id, payload) =>
  api.put(`/fleet/vehicles/${id}`, payload).then((r) => r.data.data);

export const deleteVehicle = (id) =>
  api.delete(`/fleet/vehicles/${id}`).then((r) => r.data.data);

export const getRegions = () =>
  api.get('/fleet/regions').then((r) => r.data.data);

export default api;
