#!/usr/bin/env bash
# Move the staging checkout to an exact commit from master and swap in the build
# the deploy workflow just uploaded to .next-incoming. This script is sent over
# SSH by that workflow and runs as the staging service user.
#
# Staging deploys exactly like production now: built on a runner, shipped as an
# artifact, swapped in here. Nothing compiles on the box.

set -euo pipefail

COMMIT="${1:-}"
APP_DIR="${APP_DIR:-/srv/shootismoke/staging/webapp}"
SERVICE="${SERVICE:-shootismoke-staging}"
PORT="${PORT:-3001}"
INCOMING=".next-incoming"

if [[ ! "$COMMIT" =~ ^[0-9a-f]{40}$ ]]; then
	echo "usage: stage.sh COMMIT_SHA   (got '${COMMIT:-nothing}')" >&2
	exit 2
fi

cd "$APP_DIR"

if [ ! -d "$INCOMING" ]; then
	echo "!! No $INCOMING here. The workflow ships the build before running this." >&2
	exit 1
fi

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

echo "==> Installing production dependencies"
# Built elsewhere, installed here: this is where sharp and friends get binaries
# that match this machine rather than the runner that produced the build.
CYPRESS_INSTALL_BINARY=0 npm ci --omit=dev --no-audit --no-fund

echo "==> Swapping in the new build"
# A running `next start` reads its dist directory lazily, so overwriting it in
# place would make staging throw "Cannot find module" until the copy finished.
# Swapping a fully-uploaded directory keeps the outage to a restart (~2 s).
sudo systemctl stop "$SERVICE"
rm -rf .next-previous
if [ -d .next ]; then
	mv .next .next-previous
fi
mv "$INCOMING" .next
sudo systemctl start "$SERVICE"

echo "==> Waiting for health"
for i in $(seq 1 30); do
	if curl -fsS --max-time 3 "http://127.0.0.1:$PORT/api/health" >/dev/null 2>&1; then
		echo "$COMMIT healthy after ${i}s"
		exit 0
	fi
	sleep 1
done

echo "!! $COMMIT did not come up healthy; rolling back" >&2
sudo systemctl stop "$SERVICE"
rm -rf .next
if [ -d .next-previous ]; then
	mv .next-previous .next
	sudo systemctl start "$SERVICE"
	echo "!! Rolled back to the previous build. Source is still at $COMMIT." >&2
else
	echo "!! No previous build to roll back to; staging is down." >&2
fi
exit 1
