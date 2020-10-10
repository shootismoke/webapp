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

export function RankingSection(): React.ReactElement {
	const cities = useStaticQuery(graphql`
		query AllCitiesQuery {
			allShootismokeCity(limit: 6) {
				nodes {
					api {
						shootismoke {
							dailyCigarettes
						}
					}
					name
					slug
				}
			}
		}
	`);

	return (
		<div className="pt-4">
			<SectionDivider title="Worldwide City ranking" />
			<Section>
				<div className="pt-2 max-w-6xl grid grid-flow-row grid-cols-2 grid-rows-3 gap-4">
					{cities.allShootismokeCity.nodes.map(
						(city: City, index: number) => (
							<Link
								className="w-full "
								key={city.slug}
								to={`/city/${city.slug}`}
							>
								<CityCard
									description={`${round(
										city.api?.shootismoke.dailyCigarettes ||
											0
									)} cigarettes today`}
									subtitle={city.name || ''}
									title={`${numberToOrdinal(index + 1)}`}
								/>
							</Link>
						)
					)}
				</div>
			</Section>
		</div>
	);
}
