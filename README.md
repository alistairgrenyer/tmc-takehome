# TMC Takehome: User Manager

Fast, Dockerized stack:
- FastAPI + SQLAlchemy + Alembic (Postgres)
- React (Vite + TypeScript)

Endpoints:
- GET `/users` — list users
- POST `/users/create` — create user
- DELETE `/user?id={id}` — delete user

## Quick Start
Prereq: Docker + Docker Compose

```bash
docker compose up -d --build
```

- Frontend: http://localhost:5173 (Nginx, proxies `/api` → backend)
- Backend: http://localhost:8000 (health: `/health`)

Stop:
```bash
docker compose down
```

## Backend Architecture (concise)
- `app/repositories/` — data access layer
  - `interfaces.py` (Protocol), `sqlalchemy_user_repository.py` (impl)
- `app/services/` — business logic layer
  - `interfaces.py` (Protocol), `user_service.py` (impl)
- `app/api/` — FastAPI routes + DI providers (`deps.py`, `routes.py`)
- `app/models/`, `app/schemas/` — ORM and Pydantic models
- `app/db/session.py` — engine/session base
- `alembic/` — migrations

Dependency flow: routes → service → repository → DB session.

## Configuration
Set in `.env` and `backend/.env` (Compose supplies defaults):
- `DATABASE_URL`, `POSTGRES_*`, `BACKEND_PORT`, `FRONTEND_PORT`
Default CORS allows `http://localhost:5173`.

## Development
Backend (local):
```bash
cd backend
python -m venv .venv && . .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Tests:
```bash
cd backend
pytest -q
```

Frontend (local):
```bash
cd frontend
npm install
npm run dev
```

## Notes
- Alembic initializes `users` table.
- Containers have health checks; backend runs migrations on start.
