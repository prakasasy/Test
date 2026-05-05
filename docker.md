# Docker setup for Test

This repository runs two main parts in Docker:

- **API** — ASP.NET Core (`Test.Api/`), .NET 10, SQLite
- **Client** — Angular (`client/`), either a **dev server** (`ng serve`) or a **static build** behind nginx

Orchestration is in `docker-compose.yml` at the repository root.

---

## Quick start

**Development (Angular dev server + API):**

```bash
docker compose up --build
```

| URL | Purpose |
|-----|---------|
| http://localhost:4201 | Angular UI (API calls go to `/api/…` and are proxied to the API container) |
| http://localhost:5102 | API directly (e.g. Swagger in Development) |

**Production-style (static UI + API):**

```bash
docker compose --profile prod up --build
```

| URL | Purpose |
|-----|---------|
| http://localhost:8082 | Static Angular app; `/api/` is proxied to the API container |

Stop with `Ctrl+C` or `docker compose down`. To remove named volumes as well (e.g. reset SQLite): `docker compose down -v`.

---

## Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│  Host                                                        │
│  ┌──────────────┐      ┌──────────────┐      ┌────────────┐ │
│  │  :4201       │      │  :5102       │      │  :8082     │ │
│  │  client      │      │  api         │      │  web       │ │
│  │  (ng serve)  │─────►│  Kestrel     │      │  (nginx)   │──┐
│  └──────────────┘      └──────────────┘      └────────────┘  │
│        │ proxy /api          │                    │ /api     │
│        └─────────────────────┴────────────────────┴──────────┼──► api:8080
└─────────────────────────────────────────────────────────────┘
```

- **Default compose:** `api` + `client`. The browser uses the UI on **4201**; the dev server proxies `/api` to `http://api:8080` inside the Docker network.
- **Profile `prod`:** `api` + `web`. Nginx serves the built SPA and proxies `/api/` to the same API service.

---

## Services

### `api`

- **Build:** `Dockerfile.api` (build context is the **repo root** so shared projects and `Directory.Packages.props` are included).
- **Image base:** `mcr.microsoft.com/dotnet/aspnet:10.0` at runtime.
- **Listen:** `http://+:8080` inside the container (`ASPNETCORE_URLS`).
- **Published port:** `5102:8080` — on the host, use **http://localhost:5102**.
- **Database:** SQLite at `/data/Test.db`, persisted in the named volume **`test_api_data`**.
- **Environment:** `ASPNETCORE_ENVIRONMENT=Development` so Swagger and database initialization behave like local development.

### `client` (default)

- **Image:** `node:22-bookworm`.
- **Source:** `./client` is bind-mounted for live reload.
- **`node_modules`:** stored in a **named volume** (`client_node_modules`) so installs stay fast and reliable across OS/Docker file sharing.
- **Command:** `npm ci` then `ng serve` with `--configuration docker`, `--host 0.0.0.0`, `--poll 500` (helps file watching on Windows bind mounts).
- **Depends on:** `api` starts first (ordering only; not a readiness wait).

### `web` (profile `prod`)

- **Build:** `client/Dockerfile` (multi-stage: `npm ci` + `ng build`, then nginx).
- **Not** started unless you use `--profile prod`.
- **Nginx:** Serves `dist/client/browser` and proxies `/api/` to `http://api:8080/api/` (see `client/nginx.conf`).

---

## Angular “docker” configuration

When the client runs in Docker it uses the **`docker`** Angular configuration (`client/angular.json`):

- **`client/src/environments/environment.docker.ts`** — sets `apiUrl: '/api/'` so the browser talks to the dev server origin.
- **`client/proxy.conf.json`** — dev server proxies `/api` → `http://api:8080`.

---

## Files reference

| File | Role |
|------|------|
| `docker-compose.yml` | Services, ports, volumes, `prod` profile for `web` |
| `Dockerfile.api` | Multi-stage build and publish of `Test.Api` |
| `.dockerignore` | Excludes `bin`, `obj`, `node_modules`, etc. from API build context |
| `client/Dockerfile` | Production client image (build + nginx) |
| `client/nginx.conf` | SPA routing + `/api/` proxy to the API container |
| `client/proxy.conf.json` | Dev-server proxy to `api` in compose |

---

## Common commands

```bash
# Build images and start default stack (api + client)
docker compose up --build

# Detached
docker compose up -d --build

# Logs
docker compose logs -f api

# Rebuild API only after backend changes
docker compose build api && docker compose up -d

# Production profile (api + static web)
docker compose --profile prod up --build

# Remove containers and networks
docker compose down

# Also remove volumes (deletes persisted SQLite and client node_modules volume)
docker compose down -v
```

---

## Ports summary

| Port | Service | Notes |
|------|---------|--------|
| 4201 | `client` | Host → container 4200 (Angular dev server) |
| 5102 | `api` | Host → container 8080 |
| 8082 | `web` | nginx (profile `prod` only) |

---

## Troubleshooting

- **`http://localhost:4201` does nothing / connection refused:** Check `docker compose logs client`. If logs stop at an Angular CLI analytics prompt, the compose file sets `NG_CLI_ANALYTICS=false` and `CI=true` to skip it; restart: `docker compose down` then `docker compose up --build`.
- **`npm ci` fails in `client`:** `package-lock.json` must be committed and in sync with `package.json`.
- **API not ready when the UI loads:** `depends_on` does not wait for HTTP readiness; refresh the browser or add a healthcheck if you need stricter ordering.
- **SQLite permission or missing DB:** The API uses `/data` inside the container; the `test_api_data` volume must be writable.
- **Docker engine not running (Windows):** Ensure Docker Desktop is started and set to use the Linux engine (WSL2).

---

## Requirements

- Docker Engine and Docker Compose v2
- Network access to pull base images (`node`, `mcr.microsoft.com/dotnet/*`, `nginx`)

