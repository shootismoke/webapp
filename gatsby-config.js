module.exports = {
	plugins: [
		{
			resolve: 'gatsby-plugin-web-font-loader',
			options: {
				custom: {
					families: ['gotham-black, gotham-book'],
					urls: ['/fonts/fonts.css'],
				},
			},
		},
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
	],
};
