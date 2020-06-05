const fetch = require('node-fetch');
const { resolve } = require('path');

/**
 * For each hardcoded city, we create a static page.
 * Example: For Paris, we create `/city/paris`
 */
exports.createPages = async ({ actions }) => {
	const { createPage } = actions;
	const cityTemplate = resolve(`src/templates/city.tsx`);

	const populatedCities = await fetch(
		'https://raw.githubusercontent.com/shootismoke/cities/master/all.json'
	).then((r) => r.json());

	populatedCities.forEach((city) => {
		createPage({
			path: `/city/${city.slug}`,
			component: cityTemplate,
			context: {
				city,
			},
		});
	});
};
