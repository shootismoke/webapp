module.exports = {
	webpack: (config) => {
		// @see https://github.com/vercel/next.js/blob/master/examples/with-react-native-web/next.config.js
		config.resolve.alias = {
			...(config.resolve.alias || {}),
			// Transform all direct `react-native` imports to `react-native-web`
			'react-native$': 'react-native-web',
		};
		config.resolve.extensions = [
			'.web.js',
			'.web.ts',
			'.web.tsx',
			...config.resolve.extensions,
		];

		return config;
	},
};
