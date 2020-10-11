const fetch = require('node-fetch');
const path = require('path');

exports.sourceNodes = async ({
	actions,
	createContentDigest,
	createNodeId,
}) => {
	// Download cities data from our remote API.
	const populatedCities = await fetch(
		'https://raw.githubusercontent.com/shootismoke/cities/master/all.json'
	).then((r) => r.json());

	populatedCities.forEach((city) => {
		const node = {
			...city,
			id: createNodeId(`shootismoke-city-${city.slug}`),
			internal: {
				type: `ShootismokeCity`,
				contentDigest: createContentDigest(city),
			},
		};
		actions.createNode(node);
	});

	return;
};

/**
 * For each hardcoded city, we create a static page. Example: For Paris, we
 * create `/city/paris`
 */
exports.createPages = ({ graphql, actions }) => {
	const { createPage } = actions;

	// Query all cities and all their data.
	return graphql(`
		query AllCitiesQuery {
			allShootismokeCity {
				nodes {
					adminName
					api {
						normalized {
							parameter
							value
							lastUpdated
							unit
							sourceName
							city
							country
							location
						}
						pm25 {
							parameter
							value
							lastUpdated
							unit
							sourceName
							city
							country
							location
						}
						shootismoke {
							dailyCigarettes
						}
					}
					country
					closestCities
					gps {
						latitude
						longitude
					}
					name
					photoUrl
					slug
				}
			}
		}
	`).then((result) => {
		result.data.allShootismokeCity.nodes.forEach((city) => {
			createPage({
				path: `/city/${city.slug}`,
				component: path.resolve(`./src/templates/city.tsx`),
				context: {
					city,
				},
			});
		});
	});
};
