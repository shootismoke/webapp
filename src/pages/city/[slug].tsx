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

import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';

import CityTemplate from '../../components/layout/city';
import { City, getAllCities } from '../../util';

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const cities = await getAllCities();

	const city = cities.find((c) => c.slug === params?.slug);
	if (!city) {
		throw new Error(
			'`city` will never be undefined, because of getStaticPaths. qed.'
		);
	}

	return { props: { city, cities } };
};

export const getStaticPaths: GetStaticPaths = async () => {
	const cities = await getAllCities();

	return {
		fallback: false,
		paths: cities
			.filter((city) => !!city.slug) // Just to be sure, though all cities should have a slug.
			.map((city) => ({
				params: {
					slug: city.slug,
				},
			})),
	};
};

interface CityProps {
	city: City;
	cities: City[];
	slug: string;
}

export default function CityPage(props: CityProps): React.ReactElement | null {
	const { cities, city } = props;

	return <CityTemplate city={city} cities={cities} />;
}
