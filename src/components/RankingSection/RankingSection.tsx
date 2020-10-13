// Shoot! I Smoke
// Copyright (C) 2018-2020  Marcelo S. Coelho, Amaury Martiny

// Shoot! I Smoke is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Shoot! I Smoke is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Shoot! I Smoke.  If not, see <http://www.gnu.org/licenses/>.

import { round } from '@shootismoke/ui';
import { graphql, Link, useStaticQuery } from 'gatsby';
import haversine from 'haversine';
import React, { useEffect, useState } from 'react';

import { City } from '../../util';
import { Section } from '../Section';
import { SectionDivider } from '../SectionDivider';
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
			.filter(({ distance }) => distance !== 0);

		// We then sort the distances.
		distances.sort((a, b) => a.distance - b.distance);

		setClosestCities(distances.map(({ city }) => city));
	}, [currentCity, worldCities]);

	// The cities we want to show are:
	// - either the closest cities to the current city,
	// - or just the world most polluted cities.
	const hasClosestCities = !!closestCities.length;
	const cities = (hasClosestCities ? closestCities : worldCities).slice(0, 6);

	return (
		<div className="pt-3">
			<SectionDivider
				title={
					hasClosestCities
						? 'Top Cigarettes near You'
						: 'Worldwide City ranking'
				}
			/>
			<Section className="flex flex-col items-center">
				<div className="pt-2 w-full grid grid-flow-row grid-cols-1 grid-rows-5 lg:grid-cols-2 lg:grid-rows-3 gap-4">
					{cities.map((city, index) => (
						<Link key={city.slug} to={`/city/${city.slug}`}>
							<CityCard
								description={`${round(
									city.api?.shootismoke.dailyCigarettes || 0
								)} cigarettes today`}
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
			</Section>
		</div>
	);
}
