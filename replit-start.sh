#!/usr/bin/env bash
set -euo pipefail

WORKSPACE="/home/runner/workspace"
cd "$WORKSPACE"

# Make the workspace's locally installed binaries (next, concurrently, tsx, ...)
# available on PATH.
export PATH="$WORKSPACE/node_modules/.bin:$PATH"

# Replit forces a package-firewall registry for Yarn. Override it so that
# dependencies can be installed from the public npm registry if needed.
export YARN_NPM_REGISTRY_SERVER="https://registry.npmjs.org"
export YARN_REGISTRY="https://registry.npmjs.org"

# Load the .env file into the current shell.
set -a
source .env
set +a

# Replit provides a managed PostgreSQL server via environment variables
# (PGHOST, PGUSER, PGPASSWORD, PGDATABASE). Prefer it when available.
if [ -n "${PGHOST:-}" ] && psql -h "$PGHOST" -U "${PGUSER:-postgres}" -tc "SELECT 1" >/dev/null 2>&1; then
  echo "Using managed PostgreSQL at $PGHOST"
  export DATABASE_URL="postgresql://${PGUSER:-postgres}:${PGPASSWORD:-password}@${PGHOST}:${PGPORT:-5432}/${PGDATABASE:-heliumdb}"
else
  # Fallback: start a local PostgreSQL cluster.
  PGDATA="$WORKSPACE/.pgdata"
  PG_LOG="$PGDATA/server.log"

  if [ ! -d "$PGDATA" ]; then
    echo "Initializing local PostgreSQL data directory..."
    initdb -D "$PGDATA" -U postgres --auth=trust
  fi

  # Configure the local server to listen on TCP and use a local socket directory.
  if ! grep -q "^unix_socket_directories" "$PGDATA/postgresql.conf" 2>/dev/null; then
    echo "unix_socket_directories = '$PGDATA'" >> "$PGDATA/postgresql.conf"
    echo "listen_addresses = 'localhost'" >> "$PGDATA/postgresql.conf"
  fi

  echo "Starting local PostgreSQL..."
  pg_ctl -D "$PGDATA" -l "$PG_LOG" start

  until pg_isready -q; do
    sleep 1
  done

  if ! psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname='linkinfo'" | grep -q 1; then
    echo "Creating linkinfo database..."
    psql -U postgres -c "CREATE DATABASE linkinfo;"
  fi

  export DATABASE_URL="postgresql://postgres:${POSTGRES_PASSWORD:-linkinfo}@localhost:5432/linkinfo"
fi

echo "DATABASE_URL=$DATABASE_URL"

# Prefer the Chromium binary that Replit already provides.
if [ -n "${REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE:-}" ]; then
  export PLAYWRIGHT_LAUNCH_OPTIONS_EXECUTABLE_PATH="$REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE"
fi

# Install dependencies if node_modules is missing.
if [ ! -d "$WORKSPACE/node_modules" ] || [ ! -d "$WORKSPACE/apps/web/node_modules" ]; then
  echo "Installing dependencies..."
  yarn install --immutable
fi

# Generate the Prisma client.
echo "Generating Prisma client..."
yarn prisma:generate

# Deploy database migrations.
echo "Deploying database migrations..."
yarn prisma:deploy

# Build the web application if it has not been built yet.
if [ ! -d "$WORKSPACE/apps/web/.next" ]; then
  echo "Building the web application..."
  yarn web:build
fi

# Start MeiliSearch.
MEILI_PID_FILE="$WORKSPACE/.meili.pid"
MEILI_LOG="$WORKSPACE/.meili.log"
MEILI_MASTER_KEY="${MEILI_MASTER_KEY:-$(openssl rand -base64 32)}"
export MEILI_MASTER_KEY

echo "Starting MeiliSearch..."
meilisearch --master-key "$MEILI_MASTER_KEY" --db-path "$WORKSPACE/.meili_data" --http-addr 127.0.0.1:7700 > "$MEILI_LOG" 2>&1 &
echo $! > "$MEILI_PID_FILE"

# Determine the external domain for NextAuth.
DOMAIN="${REPLIT_DOMAINS:-${REPLIT_DEV_DOMAIN:-}}"
if [ -n "$DOMAIN" ]; then
  DOMAIN="${DOMAIN%%,*}"
  export BASE_URL="https://$DOMAIN"
  export NEXTAUTH_URL="$BASE_URL/api/v1/auth"
else
  export BASE_URL="http://localhost:3000"
  export NEXTAUTH_URL="$BASE_URL/api/v1/auth"
fi

echo "Application will be served at: $BASE_URL"

# Start the web app (bound to 0.0.0.0 so Replit can expose it) and the worker.
exec concurrently \
  "cd apps/web && next start -H 0.0.0.0 -p 3000" \
  "yarn workspace @linkinfo/worker start"
