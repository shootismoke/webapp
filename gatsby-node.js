const { resolve } = require('path');

const { populateCities } = require('./scripts/populateCities');

/**
 * For each hardcoded city, we create a static page.
 * Example: For Paris, we create `/city/paris`
 */
exports.createPages = async ({ actions }) => {
	const { createPage } = actions;
	const cityTemplate = resolve(`src/templates/city.tsx`);

	const populatedCities = await populateCities();

	populatedCities.forEach((populated) => {
		createPage({
			path: `/city/${populated.city.slug}`,
			component: cityTemplate,
			context: populated,
		});
	});
};
