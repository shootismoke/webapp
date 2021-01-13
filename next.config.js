const withFonts = require('next-fonts');
const withImages = require('next-images');
const nextTM = require('next-transpile-modules');

// https://github.com/vercel/next.js/discussions/18029#discussioncomment-234977
const withTM = nextTM(['@shootismoke/ui']);

module.exports = {
	images: {
		// https://github.com/vercel/next.js/blob/master/errors/next-image-unconfigured-host.md
		domains: ['live.staticflickr.com'],
	},
	...withTM(
		withFonts(
			withImages({
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
	),
};
