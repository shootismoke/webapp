/**
 * This file is part of Sh**t! I Smoke.
 *
 * Copyright (C) 2018-2021  Marcelo S. Coelho, Amaury Martiny.
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

import { BoxButton } from '@shootismoke/ui/lib/BoxButton';
import { FrequencyContext } from '@shootismoke/ui/lib/context';
import type { Api } from '@shootismoke/ui/lib/util/api';
import { round } from '@shootismoke/ui/lib/util/api';
import {
	getAQI,
	primaryPollutant,
} from '@shootismoke/ui/lib/util/primaryPollutant';
import { distanceToStation } from '@shootismoke/ui/lib/util/station';
import c from 'classnames';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';

import warning from '../../../../assets/images/icons/warning_red.svg';
import {
	capitalize,
	City,
	getSeoTitle,
	getSwearWord,
	logEvent,
	reverseGeocode,
	sentryException,
} from '../../util';
import {
	AboutSection,
	AdSection,
	BlogSection,
	Cigarettes,
	DownloadSection,
	FeaturedSection,
	Footer,
	H1,
	HeroLayout,
	Loading,
	Nav,
	PollutantSection,
	RankingSection,
	SadFace,
	SearchBar,
	Section,
	Seo,
} from '..';

/**
 * These are errors that we know are okay, so we don't log them on Sentry.
 */
function isKnownError(error: string): boolean {
	return (
		// [openaq] Cannot normalize, got 0 result
		error.includes('Cannot normalize, got 0 result') ||
		// Station aqicn|8287 does not have PM2.5 measurings right now.
		error.includes('does not have PM2.5 measurings right now')
	);
}

interface CityProps {
	city: City;
	cities: City[];
}

export default function CityTemplate(props: CityProps): React.ReactElement {
	const { frequency, setFrequency } = useContext(FrequencyContext);
	const { city, cities } = props;
	const [api, setApi] = useState<Api | undefined>(city.api);
	const [error, setError] = useState<Error>();
	const [reverseGeoName, setReverseGeoName] = useState(city.name);

	// Log telemetry each time we change city.
	useEffect(() => {
		logEvent(
			city.slug ? `Page.City.${city.slug}.View` : 'Page.City.GPS.View',
			{
				name: city.name,
				slug: city.slug,
			}
		);
	}, [city]);

	// Number of cigarettes to display.
	const cigarettes = api
		? round(
				api.shootismoke.dailyCigarettes *
					(frequency === 'daily'
						? 1
						: frequency === 'weekly'
						? 7
						: 30)
		  )
		: undefined;

	// Decide on a swear word. The effect says that the swear word only changes
	// when the cigarettes count changes.
	const [swearWord, setSwearWord] = useState<string | undefined>(
		cigarettes ? getSwearWord(cigarettes) : undefined
	);
	useEffect(() => {
		if (!cigarettes) {
			return;
		}

		setSwearWord(getSwearWord(cigarettes));
	}, [cigarettes]);

	// Evertime we change city, reset, and fetch new values.
	useEffect(() => {
		setApi(undefined);
		setSwearWord(undefined);

		setError(undefined);
		setReverseGeoName(undefined);

		reverseGeocode(city.gps).then(setReverseGeoName).catch(sentryException);

		// This `race` file imports a bunch of stuff, so we run it lazily.
		import('@shootismoke/ui/lib/util/race')
			.then(({ raceApiPromise }) => {
				const sixHoursAgo = new Date();
				sixHoursAgo.setHours(sixHoursAgo.getHours() - 6);

				return raceApiPromise(city.gps, {
					aqicn: {
						token: process.env.NEXT_PUBLIC_AQICN_TOKEN as string,
					},
					openaq: {
						dateFrom: sixHoursAgo,
					},
				});
			})
			.then(setApi)
			.catch(setError);
	}, [city]); // eslint-disable-line react-hooks/exhaustive-deps

	// Log errors.
	useEffect(() => {
		try {
			if (!error) {
				return;
			}

			// Error message is often like: `1. {error1} 2. {error2}`.
			const errorParts = error.message.split(' 2. ');
			if (!errorParts[0] || !errorParts[1]) {
				sentryException(error);
			}
			const error1 = errorParts[0].substring(3).trim(); // remove the leading "1."
			const error2 = errorParts[1].trim();

			!isKnownError(error1) && sentryException(new Error(error1));
			!isKnownError(error2) && sentryException(new Error(error2));
		} catch (err) {
			sentryException(err);
		}
	}, [error]);

	const distance = api ? distanceToStation(city.gps, api.pm25) : undefined;

	const primaryPol = api && primaryPollutant(api.normalized);
	const aqi = api && getAQI(api.normalized);

	return (
		<>
			<Seo
				description={
					reverseGeoName
						? `Air pollution in ${city.name || reverseGeoName}. `
						: undefined
				}
				pathname={city.slug ? `/city/${city.slug}` : '/city'}
				title={getSeoTitle(api?.shootismoke.dailyCigarettes, city.name)}
			/>

			<Nav />

			<Section noPadding>
				<div className="px-6 md:px-24">
					<SearchBar
						cities={cities}
						placeholder={
							city.name
								? [city.name, city.adminName, city.country]
										.filter((x) => !!x)
										.join(', ')
								: reverseGeoName || 'Search for any city'
						}
					/>
					<p className="mt-2 type-100 text-gray-600">
						{distance !== undefined ? (
							api?.shootismoke.isAccurate === false ? (
								<Link href="/faq#station-so-far">
									<a className="text-red hover:underline">
										Air Quality Station: {distance}km away
										<img
											alt="warning"
											className="ml-1 inline"
											src={warning}
										/>
									</a>
								</Link>
							) : (
								`Air Quality Station: ${distance}km away`
							)
						) : (
							'\b' // So that the <p> doesn't collapse.
						)}
					</p>
				</div>

				{cigarettes && swearWord ? (
					<>
						<div className="mt-5 px-6 md:px-24">
							<HeroLayout
								cover={<Cigarettes cigarettes={cigarettes} />}
								title={
									<H1>
										<>
											{swearWord}! You smoke{' '}
											<span className="text-orange">
												{cigarettes >= 100
													? Math.round(cigarettes)
													: cigarettes}{' '}
												cigarette
												{cigarettes === 1 ? '' : 's'}
											</span>
										</>
									</H1>
								}
							/>
						</div>

						<div className="pl-6 md:pl-0 md:ml-24 mt-4 overflow-auto flex">
							{(['daily', 'weekly', 'monthly'] as const).map(
								(f) => (
									<div
										className="mr-4 cursor-pointer"
										key={f}
									>
										<BoxButton
											onPress={(): void => {
												logEvent(
													`City.FrequencyButton.${capitalize(
														f
													)}.Click`
												);
												setFrequency(f);
											}}
										>
											<p
												className={c(
													'py-1 type-600 md:type-700',
													f !== frequency &&
														'text-gray-200'
												)}
											>
												{f}
											</p>
										</BoxButton>
									</div>
								)
							)}
						</div>
					</>
				) : error ? (
					<SadFace
						className="mt-5 px-6 md:px-24"
						message={
							'The closest station currently does not have PM2.5 measurings.'
						}
					/>
				) : (
					<Loading className="mt-5 px-6 md:px-24" />
				)}
			</Section>

			{primaryPol && aqi && (
				<PollutantSection aqi={aqi} pollutant={primaryPol.parameter} />
			)}

			<RankingSection cities={cities} currentCity={city} />
			<AdSection />
			<AboutSection />
			<FeaturedSection />
			<BlogSection />
			<DownloadSection />
			<Footer />
		</>
	);
}
