# Development and API checks

Run commands from the repository root unless a step changes the working directory.

## Run locally

Requirements: Docker with Compose v2. From the repository root:

```bash
docker compose up -d --build --wait
docker compose ps
curl -fsS http://localhost:8000/ready
```

Open [the frontend](http://localhost:3000) or [API documentation](http://localhost:8000/docs). PostgreSQL data stays in a named volume. Demo credentials are for this classroom application only.

```bash
docker compose down
# To remove the local demo database too:
docker compose down -v
```

For manual development, start only PostgreSQL, then run the backend and frontend in separate terminals:

```bash
docker compose down
docker compose up -d postgres
cd backend
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
export DATABASE_URL=postgresql+psycopg://taskboard:taskboard@localhost:5432/taskboard
alembic upgrade head
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

```bash
cd frontend
npm ci
npm run dev -- --host 127.0.0.1
```

Open [localhost:5173](http://localhost:5173). Stop both development servers before starting the complete Compose stack.

## Tests and delivery

```bash
python -m pip install -r backend/requirements-dev.txt
python -m pytest -v backend/tests
cd frontend
npm ci
npm run build
cd ..
```

The [GitHub Actions workflow](../.github/workflows/ci-cd.yml) runs API/migration tests, frontend builds, Bandit, pip-audit, npm audit, Trivy secret and image scans. Failed checks stop publication. Successful images are tagged with the source commit and deployed with Helm into a disposable Kubernetes cluster. Browser tests, HTTP Ingress, HPA load, monitoring and GitOps reconciliation are checked there too.

[Pipeline runs](https://github.com/karttikjangid/homework-tracker-capstone/actions) · [Release downloads](https://github.com/karttikjangid/homework-tracker-capstone/releases)

Images are published to `ghcr.io/karttikjangid/homework-tracker-backend` and `ghcr.io/karttikjangid/homework-tracker-frontend`. Both packages allow anonymous pulls. The release also includes an archive of the scanned images for offline replay.

## API checks

The recorded Compose demo executed these commands against an isolated, empty database. The [command record](../screenshots/terminal/compose-commands.json) and [verification guide](verification.md) retain the responses. Reproduce this sequence with demo data.

```bash
curl -fsS -i http://localhost:8000/health && curl -fsS -i http://localhost:8000/ready
curl -fsS -i -X POST http://localhost:8000/api/tasks -H 'Content-Type: application/json' -d '{"title":"Capstone terminal demonstration","session_number":21,"due_date":"2026-10-16","assignee":"Kartik","priority":"HIGH"}'
TASK_ID=$(curl -fsS http://localhost:8000/api/tasks | python -c 'import json,sys; print(json.load(sys.stdin)[0]["id"])'); curl -fsS -i http://localhost:8000/api/tasks/$TASK_ID && curl -fsS -i -X PUT http://localhost:8000/api/tasks/$TASK_ID -H 'Content-Type: application/json' -d '{"status":"DONE"}'
curl -fsS -i http://localhost:8000/api/tasks/stats && curl -fsS -i -X DELETE http://localhost:8000/api/tasks/$TASK_ID
```
