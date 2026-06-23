#!/usr/bin/env bash
# Boots the FoodRush dev stack (Django on :8000, Vite on :5173).
# Run from the project root.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Backend
(
  cd backend
  if [ ! -d .venv ]; then
    python3 -m venv .venv
    .venv/bin/pip install -r requirements.txt
  fi
  .venv/bin/python manage.py migrate --noinput
  .venv/bin/python manage.py runserver 0.0.0.0:8000
) &
BACKEND_PID=$!

# Frontend
(
  cd frontend
  if [ ! -d node_modules ]; then
    npm install
  fi
  npm run dev -- --host 0.0.0.0
) &
FRONTEND_PID=$!

trap 'kill $BACKEND_PID $FRONTEND_PID 2>/dev/null' EXIT INT TERM

cat <<EOF

FoodRush is running:
  Frontend:  http://localhost:5173
  Backend:   http://localhost:8000
  Admin UI:  http://localhost:8000/admin

Login:
  Admin:     admin / admin123
  User:      testuser / user123

Press Ctrl+C to stop.
EOF

wait $BACKEND_PID $FRONTEND_PID
