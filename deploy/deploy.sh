#!/usr/bin/env bash
#
# Build and release shootismoke.app in place on the server.
#
#   ./deploy/deploy.sh [ref]
#
# `next build` rewrites the dist directory, and a running `next start` reads
# from it lazily -- so building straight over a live .next makes the site throw
# "Cannot find module" until the build finishes. Instead we build into
# .next-staging and swap it in, which keeps the outage to the length of a
# service restart rather than the length of a build.

set -euo pipefail

REF="${1:-production}"
APP_DIR="${APP_DIR:-/srv/shootismoke/webapp}"
SERVICE="${SERVICE:-shootismoke}"
STAGING=".next-staging"

cd "$APP_DIR"

echo "==> Fetching $REF"
git fetch --prune origin
git checkout --quiet "$REF"
git reset --hard --quiet "origin/$REF"

echo "==> Installing dependencies"
CYPRESS_INSTALL_BINARY=0 npm ci --no-audit --no-fund

echo "==> Building into $STAGING"
rm -rf "$STAGING"
NEXT_DIST_DIR="$STAGING" npm run build
# `next build` rewrites next-env.d.ts to point at whichever dist dir it used.
# Put it back so the checkout stays clean; the next `git reset --hard` would
# handle it anyway, but a dirty tree makes `git status` on the box confusing.
git checkout -- next-env.d.ts 2>/dev/null || true

# Only now do we touch the running site.
echo "==> Swapping in the new build"
sudo systemctl stop "$SERVICE"
rm -rf .next-previous
[ -d .next ] && mv .next .next-previous
mv "$STAGING" .next
sudo systemctl start "$SERVICE"

echo "==> Waiting for health"
for i in $(seq 1 30); do
  if curl -fsS --max-time 3 http://127.0.0.1:3000/api/health >/dev/null 2>&1; then
    echo "healthy after ${i}s"
    exit 0
  fi
  sleep 1
done

echo "!! Did not become healthy; rolling back"
sudo systemctl stop "$SERVICE"
rm -rf .next
mv .next-previous .next
sudo systemctl start "$SERVICE"
exit 1
