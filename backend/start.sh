#!/bin/sh
set -eu

# Wait for DB if needed (compose healthcheck covers, but keep a small retry)
python - <<'PY'
import time, os
import socket
host = os.getenv('DB_HOST') or 'db'
port_env = os.getenv('DB_PORT')
try:
    port = int(port_env) if port_env else 5432
except ValueError:
    port = 5432
s = socket.socket()
for _ in range(30):
    try:
        s.connect((host, port))
        s.close()
        break
    except Exception:
        time.sleep(1)
PY

# Run migrations
alembic upgrade head

# Start server
exec fastapi run app/main.py --host 0.0.0.0 --port 8000
