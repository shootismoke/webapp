/** @type {import('next').NextConfig} */
module.exports = {
	images: {
		// https://nextjs.org/docs/messages/next-image-unconfigured-host
		remotePatterns: [
			{ protocol: 'https', hostname: 'm.media-amazon.com' },
			{ protocol: 'https', hostname: 'live.staticflickr.com' },
		],
	},
	reactStrictMode: true,
};
