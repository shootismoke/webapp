const path = require('path');

const cities = require('./src/util/cities.json');

exports.createPages = async ({ actions }) => {
	const { createPage } = actions;
	const cityTemplate = path.resolve(`src/templates/city.tsx`);

	Object.values(cities).forEach((city) => {
		createPage({
			path: `/city/${city.slug}`,
			component: cityTemplate,
			context: {
				city,
			},
		});
	});
};
