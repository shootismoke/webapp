/** @type {import('next').NextConfig} */
module.exports = {
	// Emit a self-contained server bundle (`.next/standalone`) so the runtime
	// image does not need node_modules.
	output: 'standalone',
	images: {
		// https://nextjs.org/docs/messages/next-image-unconfigured-host
		remotePatterns: [
			{ protocol: 'https', hostname: 'm.media-amazon.com' },
			{ protocol: 'https', hostname: 'live.staticflickr.com' },
		],
	},
	reactStrictMode: true,
};
