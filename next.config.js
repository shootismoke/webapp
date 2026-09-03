const { execSync } = require('child_process');

/**
 * The commit this build came from, as a short SHA. Resolved once here and
 * inlined into the bundle by `env` below, so the footer names the code the
 * page was actually built from.
 *
 * GITHUB_SHA is set on the runner that builds every deployment. The git
 * fallback covers local builds; an empty string, when neither is available,
 * makes the footer leave the line out entirely.
 */
function buildCommit() {
	if (process.env.GITHUB_SHA) {
		return process.env.GITHUB_SHA.slice(0, 7);
	}

	try {
		return execSync('git rev-parse --short=7 HEAD', {
			stdio: ['ignore', 'pipe', 'ignore'],
		})
			.toString()
			.trim();
	} catch {
		return '';
	}
}

/** @type {import('next').NextConfig} */
module.exports = {
	// Deploys build in place on the server, so a release is built into a
	// staging directory and swapped in. `next start` reads the same variable.
	distDir: process.env.NEXT_DIST_DIR || '.next',
	env: {
		BUILD_COMMIT: buildCommit(),
	},
	images: {
		// https://nextjs.org/docs/messages/next-image-unconfigured-host
		remotePatterns: [
			{ protocol: 'https', hostname: 'm.media-amazon.com' },
			{ protocol: 'https', hostname: 'live.staticflickr.com' },
		],
		// Escape hatch for dev machines that can't reach the image hosts
		// directly. The optimizer refetches every remote image server-side, so
		// behind a proxy it 500s on all of them and the ranking cards render as
		// bare alt text. Serving the URLs unoptimized hands that fetch to the
		// browser instead. Off by default: production wants the optimizer.
		unoptimized: process.env.NEXT_IMAGES_UNOPTIMIZED === 'true',
	},
	reactStrictMode: true,
};
