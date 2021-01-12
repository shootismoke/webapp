const withFonts = require('next-fonts');
const withImages = require('next-images');

module.exports = withFonts(
	withImages({
		webpack(config) {
			return config;
		},
	})
);
