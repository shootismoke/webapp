#!/usr/bin/env bash
#
# Build shootismoke.app here and ship the result to the box.
#
#   deploy/push-build.sh prod-v1
#
# The box has 4 GB and also runs the staging dev server. Prerendering ~1000 city
# pages is by far the heaviest thing this project does, so it happens here and
# only the output travels.
#
# `.next` is portable across platforms -- it is plain JavaScript. `node_modules`
# is NOT: this checkout carries @next/swc-darwin-arm64 and a darwin `sharp`
# binary, neither of which runs on Linux. So we ship the build and let the box
# run its own `npm ci`.

set -euo pipefail

TAG="${1:-}"
DEPLOY_HOST="${DEPLOY_HOST:?set DEPLOY_HOST to the box IP or hostname}"
DEPLOY_USER="${DEPLOY_USER:-shootismoke}"
APP_DIR="${APP_DIR:-/srv/shootismoke/production/webapp}"
BUILD_DIR=".next-release"

if [[ ! "$TAG" =~ ^prod-v[0-9]+$ ]]; then
	echo "usage: deploy/push-build.sh prod-vN   (got '${TAG:-nothing}')" >&2
	exit 2
fi

cd "$(dirname "$0")/.."

# --- Make sure the build we are about to make is the tag ---------------------
# Without this you can ship your working tree under a tag's name, and then the
# tag no longer describes what is live.

if ! git rev-parse --verify --quiet "refs/tags/$TAG" >/dev/null; then
	echo "!! Tag $TAG does not exist locally. Create it first:" >&2
	echo "     git tag $TAG && git push origin $TAG" >&2
	exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
	echo "!! Working tree is dirty. Commit or stash before releasing." >&2
	git status --short >&2
	exit 1
fi

if [ "$(git rev-parse HEAD)" != "$(git rev-parse "$TAG^{commit}")" ]; then
	echo "!! HEAD is not $TAG. Check it out first: git checkout $TAG" >&2
	exit 1
fi

if ! git ls-remote --exit-code --tags origin "refs/tags/$TAG" >/dev/null 2>&1; then
	echo "!! $TAG is not pushed. The box fetches it by name: git push origin $TAG" >&2
	exit 1
fi

# --- Build -------------------------------------------------------------------

echo "==> Building $TAG into $BUILD_DIR"
rm -rf "$BUILD_DIR"
NEXT_DIST_DIR="$BUILD_DIR" npm run build
# `next build` rewrites next-env.d.ts to name whichever dist dir it used.
git checkout -- next-env.d.ts 2>/dev/null || true

# --- Ship --------------------------------------------------------------------
# Into a staging path, so a slow or half-finished transfer never becomes the
# live directory. release.sh does the swap once the whole build has landed.

echo "==> Shipping to $DEPLOY_USER@$DEPLOY_HOST"
rsync -az --delete --info=stats1 \
	"$BUILD_DIR/" \
	"$DEPLOY_USER@$DEPLOY_HOST:$APP_DIR/.next-incoming/"

echo "==> Releasing on the box"
ssh "$DEPLOY_USER@$DEPLOY_HOST" "$APP_DIR/deploy/release.sh $TAG"

echo "==> $TAG is live"
