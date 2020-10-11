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
import React from 'react';

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

export function RankingSection(
	_props: RankingSectionProps
): React.ReactElement {
	const worldCities = useStaticQuery(graphql`
		query WorldCitiesQuery {
			allShootismokeCity(limit: 6) {
				nodes {
					admin
					api {
						shootismoke {
							dailyCigarettes
						}
					}
					country
					name
					photoUrl
					slug
				}
			}
		}
	`).allShootismokeCity.nodes as City[];

	// The cities we want to show are:
	// - either the closest cities to the current city,
	// - or cities in the same country as the current city,
	// - or just the world most polluted cities.
	// TODO For now we only show the world cities.
	const cities = worldCities;

	return (
		<div className="pt-3">
			<SectionDivider title="Worldwide City ranking" />
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
										? [city.name, city.admin, city.country]
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
