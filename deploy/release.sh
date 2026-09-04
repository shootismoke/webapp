#!/usr/bin/env bash
#
# Server side of a release. Runs ON the box, invoked by deploy/push-build.sh
# once a build has been uploaded to .next-incoming.
#
#   deploy/release.sh prod-v1
#
# The build already exists; this only moves the source to the tag, installs
# platform-correct dependencies, and swaps the new build in. A running
# `next start` reads its dist directory lazily, so overwriting it in place
# would make the live site throw "Cannot find module" until the swap finished.
# Swapping a fully-uploaded directory keeps the outage to a restart (~2 s).

set -euo pipefail

TAG="${1:-}"
APP_DIR="${APP_DIR:-/srv/shootismoke/production/webapp}"
SERVICE="${SERVICE:-shootismoke}"
INCOMING=".next-incoming"

if [[ ! "$TAG" =~ ^prod-v[0-9]+$ ]]; then
	echo "usage: release.sh prod-vN   (got '${TAG:-nothing}')" >&2
	exit 2
fi

cd "$APP_DIR"

if [ ! -d "$INCOMING" ]; then
	echo "!! No $INCOMING here. Run deploy/push-build.sh $TAG from a checkout." >&2
	exit 1
fi

echo "==> Moving source to $TAG"
git fetch --tags --force --prune origin
# Detached: the deployed ref is a tag, and nothing on the box should look like
# a branch someone could commit to.
git checkout --force --detach "refs/tags/$TAG"
git reset --hard --quiet "refs/tags/$TAG"

echo "==> Checking the box's Node version"
# Ansible owns the Node major on this box (node_major in
# deploy/group_vars/all/vars.yml); a deployment never changes it. So a release
# that raises .nvmrc has to be preceded by a playbook run, and this is where
# that ordering gets enforced -- cheaply, and before anything is stopped or
# overwritten.
#
# Without it the failure surfaces as an obscure `npm ci` error (an older npm
# resolves optional peer dependencies differently and calls the lockfile out of
# sync), or worse, as a build that installs cleanly and then crashes at runtime
# on an API the older Node does not have.
want_node="$(tr -d 'v \t\r\n' < .nvmrc | cut -d. -f1)"
have_node="$(node -v | tr -d 'v' | cut -d. -f1)"
if [ "$want_node" != "$have_node" ]; then
	echo "!! This release wants Node $want_node; the box has Node $have_node." >&2
	echo "   Provision it first, then deploy again:" >&2
	echo "     cd deploy && ansible-playbook site.yml --ask-vault-pass" >&2
	exit 1
fi

echo "==> Installing production dependencies"
# Built elsewhere, installed here: this is where sharp and friends get binaries
# that match this machine rather than whoever ran the build.
CYPRESS_INSTALL_BINARY=0 npm ci --omit=dev --no-audit --no-fund

echo "==> Swapping in the new build"
sudo systemctl stop "$SERVICE"
rm -rf .next-previous
# `[ -d .next ] && mv ...` would be the last command of an AND-list, so under
# `set -e` a missing .next -- a fresh box, mid-first-release -- would exit here
# with the service already stopped.
if [ -d .next ]; then
	mv .next .next-previous
fi
mv "$INCOMING" .next
sudo systemctl start "$SERVICE"

echo "==> Waiting for health"
for i in $(seq 1 30); do
	if curl -fsS --max-time 3 "http://127.0.0.1:${PORT:-3000}/api/health" >/dev/null 2>&1; then
		echo "$TAG healthy after ${i}s"
		exit 0
	fi
	sleep 1
done

echo "!! $TAG did not come up healthy; rolling back" >&2
sudo systemctl stop "$SERVICE"
rm -rf .next
if [ -d .next-previous ]; then
	mv .next-previous .next
	sudo systemctl start "$SERVICE"
	echo "!! Rolled back to the previous build. Source is still at $TAG." >&2
else
	echo "!! No previous build to roll back to; production is down." >&2
fi
exit 1
