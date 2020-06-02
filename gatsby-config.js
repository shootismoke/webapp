module.exports = {
	plugins: [
		'gatsby-plugin-postcss',
		'gatsby-plugin-typescript',
		'gatsby-plugin-react-native-web',
		{
			resolve: 'gatsby-plugin-purgecss',
			options: {
				printRejected: true, // Print removed selectors and processed file names.
				tailwind: true, // Enable tailwindcss support.
			},
		},
	],
};
