/**
 * This file is part of Sh**t! I Smoke.
 *
 * Copyright (C) 2018-2026  Marcelo S. Coelho, Amaury.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';

import { CITIES_TO_SHOW } from '../../frontend/components';
import CityTemplate from '../../frontend/components/layout/city';
import { City, getAllCities, rankClosestCities } from '../../frontend/util';

/**
 * How often, in seconds, Next regenerates these pages in the background.
 *
 * The city list is refreshed upstream every couple of hours. On Vercel a cron
 * triggered a full rebuild of all ~1000 pages to pick that up; self-hosted we
 * let ISR do it per page, on demand.
 */
export const REVALIDATE_SECONDS = 2 * 60 * 60;

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const cities = await getAllCities();

	const city = cities.find((c) => c.slug === params?.slug);
	// With `fallback: 'blocking'` an unknown slug reaches us at request time,
	// so this is a 404 rather than an impossible state.
	if (!city) {
		return { notFound: true, revalidate: REVALIDATE_SECONDS };
	}

	// Sending all ~1000 cities to every page cost 1.45 MB per page, which is
	// ~3 GB across the prerendered site. RankingSection only ever shows
	// CITIES_TO_SHOW of them and SearchBar only needs slugs, so compute both
	// here instead.
	return {
		props: {
			city,
			rankingCities: rankClosestCities(cities, city.gps, CITIES_TO_SHOW),
			citySlugs: cities
				.map(({ slug }) => slug)
				.filter((slug): slug is string => !!slug),
		},
		revalidate: REVALIDATE_SECONDS,
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	const cities = await getAllCities();

	return {
		// Cities added upstream become available without a redeploy.
		fallback: 'blocking',
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
	rankingCities: City[];
	citySlugs: string[];
}

export default function CityPage(props: CityProps): React.ReactElement | null {
	const { citySlugs, city, rankingCities } = props;

	return (
		<CityTemplate
			city={city}
			citySlugs={citySlugs}
			rankingCities={rankingCities}
		/>
	);
}
