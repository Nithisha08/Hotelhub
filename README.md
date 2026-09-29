# HotelHub

A full-stack hotel listing app: React (Vite + Mantine + Redux) frontend, Express + PostgreSQL backend, with search, price filters, pagination, image upload, and an embedded map view.

## Quick start

### 1. Backend (server/)

```bash
cd server
npm install
cp .env.example .env        # then edit .env with your own PostgreSQL credentials
npm run setup               # creates the hotels table + indexes
npm run seed                # inserts 12 demo hotels (optional)
npm run dev                 # starts API on http://localhost:5000
```

The `.env` supports these variables (see `.env.example`):

| Variable | Description | Default |
|---|---|---|
| `PORT` | API server port | `5000` |
| `PGHOST` | PostgreSQL host | `localhost` |
| `PGPORT` | PostgreSQL port | `5544` |
| `PGUSER` | PostgreSQL user | `postgres` |
| `PGPASSWORD` | PostgreSQL password | — |
| `PGDATABASE` | PostgreSQL database name | `hotel_list_db` |

Point these at **any** PostgreSQL instance (local, Docker, or cloud) — then run `npm run setup` to create the schema and `npm run seed` to load demo data.

### 2. Frontend (client/)

```bash
cd client
npm install
npm run dev                 # starts app on http://localhost:5173
```

### Re-run anytime

- `npm run setup` — resets and recreates the `hotels` table (⚠️ deletes existing data)
- `npm run seed` — appends the 12 demo hotels again

## Project structure

```
server/
  db/
    database.js     # pg Pool from env vars
    schema.sql      # hotels table DDL + indexes
    setup.js        # applies schema.sql (npm run setup)
    seed.js         # inserts demo hotels (npm run seed)
  controllers/      # CRUD handlers
  middleware/       # multer image upload config
  routes/           # /api/hotels endpoints
client/
  src/
    components/     # HotelCard, HotelForm, Pagination
    pages/          # HotelList, HotelDetail, HotelAddEdit
    store/          # Redux slice for hotels
```

## API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/hotels` | List hotels. Query params: `title`, `minPrice`, `maxPrice`, `limit`, `offset` |
| GET | `/api/hotels/:id` | Hotel detail |
| POST | `/api/hotels` | Create hotel (multipart form with `image`) |
| PUT | `/api/hotels/:id` | Update hotel (image optional) |
| DELETE | `/api/hotels/:id` | Delete hotel (removes its uploaded image) |
