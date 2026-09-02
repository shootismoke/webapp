#!/usr/bin/env bash
# Update the staging checkout to an exact commit from master. This script is sent
# over SSH by the deploy workflow and runs as the staging service user.

set -euo pipefail

COMMIT="${1:-}"
APP_DIR="${APP_DIR:-/srv/shootismoke/staging/webapp}"
SERVICE="${SERVICE:-shootismoke-staging}"
PORT="${PORT:-3001}"

if [[ ! "$COMMIT" =~ ^[0-9a-f]{40}$ ]]; then
	echo "usage: stage.sh COMMIT_SHA   (got '${COMMIT:-nothing}')" >&2
	exit 2
fi

cd "$APP_DIR"

# A canceled runner can leave its remote SSH process alive briefly. Serialize
# on the box too, then skip this deployment if master has moved on meanwhile.
exec 9>"$APP_DIR/../.deploy-staging.lock"
flock 9

echo "==> Fetching master"
git fetch --force origin master

if [ "$(git rev-parse refs/remotes/origin/master)" != "$COMMIT" ]; then
	echo "==> $COMMIT was superseded by a newer master commit; skipping"
	exit 0
fi

echo "==> Moving staging to $COMMIT"
git checkout --force -B master "$COMMIT"
git reset --hard --quiet "$COMMIT"

echo "==> Installing dependencies"
CYPRESS_INSTALL_BINARY=0 npm ci --no-audit --no-fund

echo "==> Restarting staging"
sudo systemctl restart "$SERVICE"

echo "==> Waiting for health"
for i in $(seq 1 30); do
	if curl -fsS --max-time 3 "http://127.0.0.1:$PORT/api/health" >/dev/null 2>&1; then
		echo "$COMMIT healthy after ${i}s"
		exit 0
	fi
	sleep 1
done

echo "!! Staging did not become healthy" >&2
exit 1
