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

import { MatchRenderProps } from '@reach/router';
import React from 'react';

import CityTemplate from '../../templates/city';
import { City, getAllCities } from '../../util';

export async function getStaticProps(): Promise<{ props: { cities: City[] } }> {
	const cities = await getAllCities();

	return { props: { cities } };
}

export async function getStaticPaths(): Promise<{
	fallback: false;
	paths: {
		params: {
			id: string | undefined;
		};
	}[];
}> {
	const cities = await getAllCities();

	return {
		fallback: false,
		paths: cities.map((city) => ({
			params: {
				id: city.slug,
			},
		})),
	};
}

interface CityProps extends MatchRenderProps<void> {
	cities: City[];
	slug: string;
}

export default function CityPage(props: CityProps): React.ReactElement | null {
	const { cities, slug } = props;
	const city = cities.find((c) => c.slug === slug);
	if (!city) {
		throw new Error(
			'`city` will never be undefined, because of getStaticPaths. qed.'
		);
	}

	return <CityTemplate city={city} cities={cities} />;
}
