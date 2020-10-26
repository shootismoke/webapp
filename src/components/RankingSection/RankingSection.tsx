// Sh**t! I Smoke
// Copyright (C) 2018-2020  Marcelo S. Coelho, Amaury Martiny

// Sh**t! I Smoke is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Sh**t! I Smoke is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Sh**t! I Smoke.  If not, see <http://www.gnu.org/licenses/>.

import { round } from '@shootismoke/ui/lib/util/api';
import { graphql, Link, useStaticQuery } from 'gatsby';
import haversine from 'haversine';
import React, { useEffect, useState } from 'react';

import { City, logEvent } from '../../util';
import { Section } from '../Section';
import { CityCard } from './CityCard';

/**
 * Convert a number to an ordinal, e.g. 1 to 1st.
 * @param n - The number to convert to ordinal.
 */
function numberToOrdinal(n: number): string {
	switch (n) {
		case 1:
			return '1st';
		case 2:
			return '2nd';
		case 3:
			return '3rd';
		default:
			return `${n}th`;
	}
}

interface RankingSectionProps {
	currentCity?: City;
}

/**
 * Number of cities to show in the ranking.
 */
const CITIES_TO_SHOW = 6;

export function RankingSection(props: RankingSectionProps): React.ReactElement {
	const { currentCity } = props;
	const worldCities = useStaticQuery(graphql`
		query WorldCitiesQuery {
			allShootismokeCity {
				nodes {
					adminName
					api {
						shootismoke {
							dailyCigarettes
							isAccurate
						}
					}
					country
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
	`).allShootismokeCity.nodes as City[];
	const [closestCities, setClosestCities] = useState<City[]>([]);

	// Each time we change city, find the closest cities.
	useEffect(() => {
		setClosestCities([]);
		if (!currentCity) {
			return;
		}

		// We naively calculate the distance from our current city to all the
		// other cities in the database.
		const distances = worldCities
			.map((city) => ({
				city,
				distance: haversine(currentCity.gps, city.gps),
			}))
			.filter(({ distance }) => distance !== 0) // Remove current city.
			.filter(
				({ city }) => city.api && city.api.shootismoke.isAccurate // Filter out cities with inaccurate API.
			);

		// We then sort the distances.
		distances.sort((a, b) => a.distance - b.distance);

		// We take the CITIES_TO_SHOW first cities.
		const citiesToShow = distances
			.slice(0, CITIES_TO_SHOW)
			.map(({ city }) => city);

		// We sort these cities again, this time by cigarettes.
		citiesToShow.sort((a, b) => {
			if (!a.api || !b.api) {
				throw new Error(
					'We already filtered out the Apis that were not undefined. qed.'
				);
			}

			return (
				b.api?.shootismoke.dailyCigarettes -
				a.api?.shootismoke.dailyCigarettes
			);
		});

		setClosestCities(citiesToShow);
	}, [currentCity, worldCities]);

	// The cities we want to show are:
	// - either the closest cities to the current city,
	// - or just the world most polluted cities.
	const hasClosestCities = !!closestCities.length;
	const cities = hasClosestCities
		? closestCities
		: worldCities.slice(0, CITIES_TO_SHOW);

	return (
		<Section
			title={
				hasClosestCities
					? 'Top Cigarettes near You'
					: 'Worldwide City ranking'
			}
		>
			<div className="flex flex-col items-center">
				<p className="-mt-5 mb-5 type-100 text-center text-gray-600">
					Updated every two hours. Real-time ranking may differ.
				</p>
				<div className="pt-2 w-full grid grid-flow-row grid-cols-1 grid-rows-5 md:grid-cols-2 md:grid-rows-3 gap-4">
					{cities.map((city, index) => (
						<Link
							key={city.slug}
							to={`/city/${city.slug}`}
							onClick={(): void =>
								logEvent('RankingSection.CityCard.Click', {
									rank: index + 1,
									slug: city.slug,
								})
							}
						>
							<CityCard
								description={
									city.api?.shootismoke.dailyCigarettes
										? `${round(
												city.api.shootismoke
													.dailyCigarettes
										  )} cigarettes today`
										: 'Loading cigarettes...'
								}
								photoUrl={city.photoUrl}
								subtitle={
									city.name
										? [
												city.name,
												city.adminName,
												city.country,
										  ]
												.filter((x) => !!x)
												.join(', ')
										: 'Loading city...'
								}
								title={`${numberToOrdinal(index + 1)}`}
							/>
						</Link>
					))}
				</div>
			</div>
		</Section>
	);
}
