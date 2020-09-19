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

import { City } from '../CurrentLocation';
import { Section } from '../Section';
import { SectionDivider } from '../SectionDivider';

export function RankingSection(): React.ReactElement {
	const cities = useStaticQuery(graphql`
		query AllCitiesQuery {
			allShootismokeCity(limit: 10) {
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
		<>
			<SectionDivider title="City ranking" />
			<Section>
				<ul>
					{cities.allShootismokeCity.nodes.map((city: City) => (
						<li key={city.slug}>
							<Link
								className="underline"
								to={`/city/${city.slug}`}
							>
								{city.name}
							</Link>
							:{' '}
							{round(city.api?.shootismoke.dailyCigarettes || 0)}{' '}
							cigarettes
						</li>
					))}
				</ul>
			</Section>
		</>
	);
}
