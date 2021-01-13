const withFonts = require('next-fonts');
const withOptimizedImages = require('next-optimized-images');
const nextTM = require('next-transpile-modules');

// https://github.com/vercel/next.js/discussions/18029#discussioncomment-234977
const withTM = nextTM(['@shootismoke/ui']);

module.exports = withTM(
	withFonts(
		withOptimizedImages({
			// https://github.com/vercel/next.js/blob/master/examples/with-react-native-web/next.config.js
			webpack: (config) => {
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
		})
	)
);
