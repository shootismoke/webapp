module.exports = {
	webpack: (config) => {
		config.resolve.alias = {
			...(config.resolve.alias || {}),
			// Transform all direct `react-native` imports to `react-native-web`
			// @see https://github.com/vercel/next.js/blob/master/examples/with-react-native-web/next.config.js
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
