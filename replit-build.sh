#!/usr/bin/env bash
set -euo pipefail

WORKSPACE="/home/runner/workspace"
cd "$WORKSPACE"

export PATH="$WORKSPACE/node_modules/.bin:$PATH"

# Replit forces a package-firewall registry for Yarn. Override it so that
# dependencies can be installed from the public npm registry.
export YARN_NPM_REGISTRY_SERVER="https://registry.npmjs.org"
export YARN_REGISTRY="https://registry.npmjs.org"

# Load the .env file.
set -a
source .env
set +a

echo "Installing dependencies..."
yarn install --immutable

echo "Generating Prisma client..."
yarn prisma:generate

echo "Building the web application..."
yarn web:build

echo "Build complete."
