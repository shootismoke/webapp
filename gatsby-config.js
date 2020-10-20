module.exports = {
	plugins: [
		'gatsby-plugin-postcss',
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
				environments: ['development', 'production'],
				respectDNT: true,
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
