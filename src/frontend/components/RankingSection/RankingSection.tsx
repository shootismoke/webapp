/**
 * This file is part of Sh**t! I Smoke.
 *
 * Copyright (C) 2018-2021  Marcelo S. Coelho, Amaury M.
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

import { LatLng } from '@shootismoke/dataproviders';
import { round } from '@shootismoke/ui';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { City, doNotTrack, logEvent, rankClosestCities } from '../../util';
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
	cities: City[];
}

/**
 * Number of cities to show in the ranking.
 */
const CITIES_TO_SHOW = 6;

export function RankingSection(props: RankingSectionProps): React.ReactElement {
	const { currentCity: currentCityFromProps, cities } = props;

	// If currentCity is not provided from props, then we try to find the
	// current city from IP geolocation.
	const [currentCity, setCurrentCity] = useState(currentCityFromProps);
	const [closestCities, setClosestCities] = useState<City[]>([]);

	// Each time we change city, find the closest cities.
	useEffect(() => {
		setClosestCities([]);
		if (!currentCity) {
			return;
		}

		const citiesToShow = rankClosestCities(
			cities,
			currentCity.gps,
			CITIES_TO_SHOW
		);

		setClosestCities(citiesToShow);
	}, [currentCity, cities]);

	// Each time we change city and we don't have a city fro props, then get
	// the current city from IP address geolocation.
	useEffect(() => {
		if (doNotTrack()) {
			return;
		}

		if (currentCity) {
			return;
		}

		axios
			.get<Partial<LatLng>>('https://api.ipdata.co/?api-key=test')
			.then(({ data }) => {
				if (data.latitude && data.longitude) {
					setCurrentCity({ gps: data as LatLng });
				}
			})
			.catch(() => undefined); // no-op.
	}, [currentCity]);

	// The cities we want to show are:
	// - either the closest cities to the current city,
	// - or just the world most polluted cities.
	const hasClosestCities = !!closestCities.length;
	const citiesToShow = hasClosestCities
		? closestCities
		: cities.slice(0, CITIES_TO_SHOW);

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
					{currentCity && !currentCityFromProps && (
						<span>
							<br />
							Current location taken from IP address.
						</span>
					)}
				</p>
				<div className="pt-2 w-full grid grid-flow-row grid-cols-1 grid-rows-5 md:grid-cols-2 md:grid-rows-3 gap-4">
					{citiesToShow.map((city, index) => (
						<Link
							key={city.slug}
							// city.slug is always defined in `cities`
							// eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
							href={`/city/${city.slug!}`}
						>
							<a data-cy={`RankingSection-city-card-${index}`}>
								<CityCard
									description={
										city.api?.shootismoke.dailyCigarettes
											? `${round(
													city.api.shootismoke
														.dailyCigarettes
											  )} cigarettes today`
											: 'Loading cigarettes...'
									}
									onClick={(): void =>
										logEvent(
											'RankingSection.CityCard.Click',
											{
												rank: index + 1,
												slug: city.slug,
											}
										)
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
							</a>
						</Link>
					))}
				</div>
			</div>
		</Section>
	);
}
