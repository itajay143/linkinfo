#!/usr/bin/env bash
set -euo pipefail

# Replit already provides a Chromium binary via REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE.
# If a custom executable path or an existing browser directory is configured, skip
# downloading the browser inside the sandbox.
if [ -n "${PLAYWRIGHT_LAUNCH_OPTIONS_EXECUTABLE_PATH:-}" ]; then
  echo "Using system Chromium at $PLAYWRIGHT_LAUNCH_OPTIONS_EXECUTABLE_PATH"
  exit 0
fi

if [ -n "${PLAYWRIGHT_BROWSERS_PATH:-}" ] && [ -d "$PLAYWRIGHT_BROWSERS_PATH" ]; then
  echo "Using existing Playwright browsers at $PLAYWRIGHT_BROWSERS_PATH"
  exit 0
fi

# Otherwise, download the Chromium browser (without system dependencies) so the
# postinstall step can succeed in sandboxed environments like Replit.
playwright install chromium
