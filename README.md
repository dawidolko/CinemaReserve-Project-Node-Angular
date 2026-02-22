# CinemaReserve

Full-stack cinema seat reservation application inspired by real cinema booking systems like Multikino and Helios. Built with Angular 19, Node.js, MySQL, and Docker.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Angular 19 (standalone components), Tailwind CSS 3 |
| **Backend** | Node.js, Express, Sequelize ORM |
| **Database** | MySQL 8.0 |
| **Auth** | JWT (JSON Web Tokens) |
| **Infrastructure** | Docker & Docker Compose, Nginx |

## Quick Start

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Run

```bash
docker compose -f .tools/docker/docker-compose.yml up --build
```

The app will be available at **http://localhost** (port 80).

> See [.tools/docker/README.md](.tools/docker/README.md) for detailed Docker setup instructions.

### Seed Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@cinema.pl | Admin123! | Admin |
| manager@cinema.pl | Manager123! | Admin |
| jan.wisniewski@email.pl | User123! | User |

## Features

### Public Pages
- **Home** — Hero banner, "Now Showing" movie grid with hover effects, "Coming Soon" section, promo banner
- **Movie Detail** — Full-width backdrop, screening schedule grouped by date tabs
- **Seat Selection** — Interactive seat map (color-coded: free/taken/selected/VIP), booking summary sidebar
- **My Reservations** — Card-based reservation list with status badges, cancel option
- **Auth** — Split-screen login/register pages with JWT authentication

### Admin Panel (Berry-inspired)
- **Dashboard** — 4 stat cards, recent reservations table, quick stats
- **Movies** — CRUD with search, poster preview, inline editing
- **Screenings** — Create/delete screenings with movie/hall selects
- **Halls** — Card grid with seat stats, create/delete
- **Users** — User table with inline role change (user/admin)
- **Reservations** — All reservations with status/search/date filters
- **CMS Content** — Edit hero titles, footer text, promo content
- **Sections** — Reorder and toggle visibility of home page sections

### Other
- Collapsible admin sidebar with mobile drawer
- Fully responsive (375px — 1440px)
- CMS-driven content (hero text, footer, promotions)
- 20 real movies with TMDB poster images

## Architecture

```
Browser → Nginx (port 80)
            ├── Static files (Angular SPA)
            └── /api/* → Express (port 3000) → MySQL (port 3306)
```

## Project Structure

```
├── .tools/
│   └── docker/
│       ├── docker-compose.yml    # Orchestrates all services
│       ├── Dockerfile.backend    # Node.js Express container
│       ├── Dockerfile.frontend   # Angular build → Nginx container
│       ├── nginx.conf            # Nginx reverse proxy config
│       └── README.md             # Docker setup instructions
├── backend/
│   ├── src/
│   │   ├── models/         # Sequelize models (User, Movie, Hall, Seat, Screening, Reservation, SiteContent, SectionOrder)
│   │   ├── routes/         # Express routes (auth, movies, halls, screenings, reservations, content, admin)
│   │   ├── middleware/      # JWT auth & admin guard
│   │   ├── seeders/        # Database seed (20 movies, 12 users, 3 halls, 490 screenings)
│   │   ├── app.js          # Express app setup
│   │   └── server.js       # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/       # Services, guards, interceptors
│   │   │   ├── shared/     # Navbar, footer components
│   │   │   └── pages/      # Home, movie-detail, seat-select, login, register, my-reservations, admin/*
│   │   ├── styles.scss     # Global styles with Tailwind directives
│   │   └── index.html
│   ├── tailwind.config.js  # Custom cinema theme
│   └── package.json
└── README.md
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | - | Register new user |
| POST | `/api/auth/login` | - | Login, returns JWT |
| GET | `/api/movies` | - | List all movies |
| GET | `/api/movies/:id` | - | Movie detail with screenings |
| POST | `/api/movies` | Admin | Create movie |
| PUT | `/api/movies/:id` | Admin | Update movie |
| DELETE | `/api/movies/:id` | Admin | Delete movie |
| GET | `/api/halls` | - | List all halls |
| POST | `/api/halls` | Admin | Create hall with seats |
| DELETE | `/api/halls/:id` | Admin | Delete hall |
| GET | `/api/screenings` | - | List all screenings |
| GET | `/api/screenings/:id` | - | Screening with seat availability |
| POST | `/api/screenings` | Admin | Create screening |
| DELETE | `/api/screenings/:id` | Admin | Delete screening |
| GET | `/api/reservations/my` | User | User's reservations |
| POST | `/api/reservations` | User | Create reservation |
| PUT | `/api/reservations/:id/cancel` | User | Cancel reservation |
| GET | `/api/content` | - | CMS content (key-value) |
| PUT | `/api/content/:key` | Admin | Update CMS content |
| GET | `/api/content/sections` | - | Home page sections order |
| PUT | `/api/content/sections` | Admin | Update section order |
| GET | `/api/admin/stats` | Admin | Dashboard statistics |
| GET | `/api/admin/reservations` | Admin | All reservations |
| GET | `/api/admin/users` | Admin | User list |
| PUT | `/api/admin/users/:id/role` | Admin | Change user role |

## Seed Data

- **20 movies** with real titles, descriptions, directors, and TMDB poster images (Inception, Interstellar, The Dark Knight, Dune: Part Two, Oppenheimer, and more)
- **12 users** (2 admins, 10 regular users)
- **3 halls** (Sala 1: 12x14 seats, Sala 2: 10x12, Sala VIP: 8x10 with VIP rows)
- **490 screenings** spread across 7 days
- **CMS content** (hero title, hero subtitle, footer text, promo text)
- **4 home sections** (hero, now_showing, coming_soon, promo)

## Styling

The app uses **Tailwind CSS 3** with a custom dark cinema theme:

- Background: `#0b0e17` (dark navy)
- Primary: `#e50914` (cinema red)
- Accent: `#d4a843` (gold for VIP/premium)
- Typography: Inter (Google Fonts)

Global component classes (`.btn`, `.badge`, `.card`, `.form-group`, `.admin-table`) are defined in `styles.scss` using `@layer components` with `@apply`.

## Development (without Docker)

```bash
# Terminal 1 — Backend
cd backend
npm install
npm run seed    # seed the database (requires MySQL running)
npm start       # http://localhost:3000

# Terminal 2 — Frontend
cd frontend
npm install
npx ng serve    # http://localhost:4200
```

Set environment variables for the backend: `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, `JWT_SECRET`.

## License

MIT
