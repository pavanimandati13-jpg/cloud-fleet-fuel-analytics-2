# Cloud-Based Fleet Fuel Consumption Analytics

A full-stack web application that gives fleet operators a cloud-hosted dashboard for
monitoring, analyzing, and reporting on vehicle fuel/energy consumption, cost, and
CO₂ emissions.

**Stack:** React (Vite) + HTML/CSS/JS on the frontend, Node.js/Express REST API on the
backend. Designed to be deployed to any cloud platform (AWS, Azure, GCP, Render, Railway,
Heroku, etc.) as two independent services, or as one via the included Docker setup.

---

## Project structure

```
cloud-fleet-fuel-analytics/
├── backend/                 # Node.js + Express REST API
│   ├── data/mockData.js     # In-memory data generator (swap for a real DB in production)
│   ├── middleware/errorHandler.js
│   ├── routes/fleet.js      # Vehicle CRUD endpoints
│   ├── routes/analytics.js  # Aggregated analytics endpoints
│   ├── server.js
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
├── frontend/                 # React (Vite) single-page dashboard
│   ├── src/
│   │   ├── components/       # Sidebar, Dashboard, VehicleList, AlertsPanel, charts
│   │   ├── services/api.js   # Axios API client
│   │   ├── App.jsx / App.css
│   │   └── main.jsx / index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Features

- **Dashboard** — KPI cards (total distance, fuel used, cost, CO₂, average efficiency),
  a 30-day consumption trend chart, consumption by region, consumption by vehicle type,
  and top/bottom 5 vehicles by efficiency.
- **Vehicles** — searchable, filterable fleet table (by region, status, driver, vehicle number).
- **Alerts** — automatically flags vehicles with abnormally low efficiency or vehicles
  currently under maintenance.
- **REST API** — clean, versionless JSON API ready to be backed by a real cloud database
  (MongoDB Atlas, DynamoDB, PostgreSQL/RDS, etc.) by replacing `backend/data/mockData.js`
  with real queries.

## Running locally

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev        # starts on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev         # starts on http://localhost:5173
```

The Vite dev server proxies `/api/*` requests to `http://localhost:5000`, so no extra
CORS configuration is needed while developing.

Open **http://localhost:5173** in your browser.

## Running with Docker Compose

```bash
docker compose up --build
```

- Frontend → http://localhost:8080
- Backend API → http://localhost:5000

## API reference

| Method | Endpoint                              | Description                              |
|--------|----------------------------------------|-------------------------------------------|
| GET    | /api/health                            | Health check                              |
| GET    | /api/fleet/vehicles                    | List vehicles (filters: region, status, fuelType, search) |
| GET    | /api/fleet/vehicles/:id                | Vehicle detail + fuel logs                |
| POST   | /api/fleet/vehicles                    | Register a new vehicle                    |
| PUT    | /api/fleet/vehicles/:id                | Update a vehicle                          |
| DELETE | /api/fleet/vehicles/:id                | Remove a vehicle                          |
| GET    | /api/fleet/regions                     | Distinct list of regions                  |
| GET    | /api/analytics/summary                 | Fleet-wide KPI summary                    |
| GET    | /api/analytics/trend?days=30           | Daily consumption trend                   |
| GET    | /api/analytics/by-region               | Consumption grouped by region             |
| GET    | /api/analytics/by-vehicle-type         | Consumption grouped by vehicle type       |
| GET    | /api/analytics/top-vehicles?metric=&order=&limit= | Ranked vehicles by efficiency/fuel/cost |
| GET    | /api/analytics/alerts                  | Active alerts / anomalies                 |

## Deploying to the cloud

- **Backend**: deploy `backend/` as a Node.js web service (Render, Railway, AWS Elastic
  Beanstalk, Azure App Service, Google Cloud Run, or an EC2/VM behind a load balancer).
  Set `CORS_ORIGIN` to your deployed frontend URL.
- **Frontend**: run `npm run build` inside `frontend/` to produce a static `dist/` folder,
  then host it on any static hosting/CDN (S3 + CloudFront, Netlify, Vercel, Azure Static
  Web Apps, Firebase Hosting, etc.), or use the provided `frontend/Dockerfile` which builds
  and serves it via Nginx.
- **Database**: replace the in-memory mock data in `backend/data/mockData.js` with a real
  managed database (MongoDB Atlas, Amazon RDS/DynamoDB, Azure Cosmos DB, etc.) for
  production use — the route handlers are already isolated so this is a drop-in change.

## Notes

- All data in this build is generated in-memory on server start, so it will reset any time
  the backend restarts. This makes it easy to demo without setting up a database first.
- Replace the mock data layer with real telematics/GPS/fuel-card integrations for a
  production deployment.
