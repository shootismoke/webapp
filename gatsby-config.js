module.exports = {
	siteMetadata: {
		siteUrl: 'https://shootismoke.app',
	},
	plugins: [
		'gatsby-plugin-postcss',
		'gatsby-plugin-sharp',
		'gatsby-transformer-sharp',
		{
			resolve: 'gatsby-source-filesystem',
			options: {
				path: `${__dirname}/assets/images`,
			},
		},
		'gatsby-plugin-react-helmet',
		'gatsby-plugin-react-native-web',
		'gatsby-plugin-typescript',
		{
			resolve: 'gatsby-plugin-purgecss',
			options: {
				printRejected: true, // Print removed selectors and processed file names.
				tailwind: true, // Enable tailwindcss support.
			},
		},
		'gatsby-plugin-robots-txt',
		'gatsby-plugin-sitemap',
		{
			resolve: 'gatsby-plugin-amplitude-analytics',
			options: {
				apiKey: process.env.AMPLITUDE_API_KEY,
				respectDNT: true,
				eventTypes: {
					pageView: 'Route.Update',
				},
				amplitudeConfig: {
					includeGclid: true,
					includeReferrer: true,
					includeUtm: true,
					// We never track PII.
					trackingOptions: {
						city: false,
						country: true,
						carrier: false,
						device_manufacturer: false,
						device_model: false,
						dma: false,
						ip_address: false,
						language: true,
						os_name: true,
						os_version: true,
						platform: true,
						region: false,
						version_name: true,
					},
				},
				environments: ['production'],
			},
		},
		{
			resolve: '@sentry/gatsby',
			options: {
				dsn: process.env.SENTRY_API_KEY,
			},
		},
	],
};
