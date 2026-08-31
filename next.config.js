/** @type {import('next').NextConfig} */
module.exports = {
	// Deploys build in place on the server, so a release is built into a
	// staging directory and swapped in. `next start` reads the same variable.
	distDir: process.env.NEXT_DIST_DIR || '.next',
	images: {
		// https://nextjs.org/docs/messages/next-image-unconfigured-host
		remotePatterns: [
			{ protocol: 'https', hostname: 'm.media-amazon.com' },
			{ protocol: 'https', hostname: 'live.staticflickr.com' },
		],
	},
	reactStrictMode: true,
};
