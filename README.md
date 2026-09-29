# HotelHub

A full-stack hotel listing app: React (Vite + Redux Toolkit) frontend with plain JSX components and vanilla CSS in a white/green theme, Express + PostgreSQL backend, with search, price filters, pagination, WebP image upload, and an embedded map view. Icons are provided by [lucide-react](https://lucide.dev) — no component library, no CSS framework.

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

- `npm run setup` — resets and recreates the `hotels` table (warning: deletes existing data)
- `npm run seed` — appends the 12 demo hotels again
- `npm run convert:webp` — migrates existing hotel images to WebP (see below)

## Image handling and WebP pipeline

All uploaded images are converted to WebP before being stored:

1. `multer` receives the upload into **memory** (5 MB limit, JPG/PNG/WebP only) — nothing is written to disk in its original format
2. the `convertToWebP` middleware re-encodes the image with `sharp` (WebP, quality 80) and writes it to `server/uploads/` with a random hex filename
3. the controller stores `/uploads/<name>.webp` in the database
4. the client resolves image paths with `resolveImageUrl()` (`client/src/utils/image.js`), which prefixes local paths with the server URL and leaves absolute URLs untouched

The frontend requests remote images (e.g. Unsplash) with `fm=webp` so browsers receive WebP there too.

### Migrating existing images

If the database still references old-format uploads or remote seed URLs, run:

```bash
cd server
npm run convert:webp
```

The script scans every `hotels.image`, then:

- **local uploads** (`/uploads/foo.jpg`) — re-encoded to WebP, DB path updated, original file deleted
- **remote URLs** (e.g. Unsplash seed data) — downloaded, converted to WebP, saved to `uploads/`, and the DB row is pointed at the local file (a 404 source is reported and skipped)
- **already WebP** — left untouched

A summary of converted/skipped counts is printed when it finishes. Run it once after seeding; new uploads are converted automatically by the server middleware.

## Project structure

```
server/
  db/
    database.js       # pg Pool from env vars
    schema.sql        # hotels table DDL + indexes
    setup.js          # applies schema.sql (npm run setup)
    seed.js           # inserts demo hotels (npm run seed)
    convertToWebP.js  # one-off image-to-WebP migration (npm run convert:webp)
  controllers/        # CRUD handlers
  middleware/
    uploadMiddleware.js  # multer memory storage + MIME/size limits
    webpMiddleware.js    # sharp-based WebP conversion before save
  routes/             # /api/hotels endpoints
client/
  src/
    components/       # HotelCard, HotelForm, Pagination, Toast
    pages/            # HotelList, HotelDetail, HotelAddEdit
    store/            # Redux slice for hotels
    utils/image.js    # image URL resolution (local uploads vs remote URLs)
    index.css         # vanilla CSS theme (white/green)
```

## API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/hotels` | List hotels. Query params: `title`, `minPrice`, `maxPrice`, `limit`, `offset` |
| GET | `/api/hotels/:id` | Hotel detail |
| POST | `/api/hotels` | Create hotel (multipart form with `image`, converted to WebP) |
| PUT | `/api/hotels/:id` | Update hotel (image optional, converted to WebP) |
| DELETE | `/api/hotels/:id` | Delete hotel (removes its uploaded image) |
