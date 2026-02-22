# Docker Setup

This directory contains all Docker configuration files for the CinemaReserve project.

## Files

| File | Description |
|------|-------------|
| `docker-compose.yml` | Orchestrates all 3 services (MySQL, Express backend, Angular frontend via Nginx) |
| `Dockerfile.backend` | Node.js 20 Alpine — installs deps, seeds DB, starts Express server |
| `Dockerfile.frontend` | Multi-stage build — Angular production build (Node) → Nginx static server |
| `nginx.conf` | Nginx config — serves SPA, proxies `/api/*` requests to backend |

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

## How to Run

From the **project root** directory:

```bash
docker compose -f .tools/docker/docker-compose.yml up --build
```

The application will be available at **http://localhost** (port 80).

To stop the containers:

```bash
docker compose -f .tools/docker/docker-compose.yml down
```

To stop and remove all data (including the database volume):

```bash
docker compose -f .tools/docker/docker-compose.yml down -v
```

## Services

| Service | Container | Port | Description |
|---------|-----------|------|-------------|
| `db` | cinema-db | 3307 (host) → 3306 | MySQL 8.0 database |
| `backend` | cinema-backend | 3000 | Express API server |
| `frontend` | cinema-frontend | 80 | Nginx serving Angular SPA |

## Test Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@cinema.pl | Admin123! | Admin |
| manager@cinema.pl | Manager123! | Admin |
| jan.wisniewski@email.pl | User123! | User |

## Architecture

```
Browser → Nginx (port 80)
            ├── Static files (Angular SPA)
            └── /api/* → Express (port 3000) → MySQL (port 3306)
```

## Troubleshooting

- **Port 3307 in use**: Another MySQL instance may be running. Stop it or change the port mapping in `docker-compose.yml`.
- **Backend keeps restarting**: The backend waits for MySQL to be healthy before starting. Give it 15-20 seconds on first run.
- **Stale data**: Run `docker compose -f .tools/docker/docker-compose.yml down -v` to wipe the database, then `up --build` again to reseed.
