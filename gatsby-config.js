module.exports = {
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
		{
			resolve: `gatsby-plugin-prefetch-google-fonts`,
			options: {
				fonts: [
					{
						family: 'Montserrat',
						variants: ['500', '800'],
					},
				],
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
		{
			resolve: 'gatsby-plugin-amplitude-analytics',
			options: {
				apiKey: process.env.AMPLITUDE_API_KEY,
				respectDNT: true,
				eventTypes: {
					pageView: 'Route.Update',
				},
				amplitudeConfig: {
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
		'gatsby-plugin-webpack-bundle-analyser-v2',
	],
};
