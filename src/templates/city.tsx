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

import { NavigateOptions } from '@reach/router';
import {
	Api,
	BoxButton,
	distanceToStation,
	FrequencyContext,
	getAQI,
	primaryPollutant,
	raceApiPromise,
	round,
} from '@shootismoke/ui';
import c from 'classnames';
import { Link } from 'gatsby';
import React, { useContext, useEffect, useState } from 'react';

import warning from '../../assets/images/icons/warning_red.svg';
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
	SearchLocationState,
	Section,
	Seo,
} from '../components';
import { t } from '../localization';
import {
	capitalize,
	City,
	getSeoTitle,
	logEvent,
	reverseGeocode,
	sentryException,
} from '../util';

/**
 * Swear words, untranslated.
 */
const swearWords = [
	'home_swear_word_shoot',
	'home_swear_word_dang',
	'home_swear_word_darn',
	'home_swear_word_geez',
	'home_swear_word_omg',
	'home_swear_word_crap',
	'home_swear_word_arrgh',
];

/**
 * Return a random swear word, untranslated.
 *
 * @param cigaretteCount - The cigarette count for which we show the swear
 * word.
 */
function getSwearWord(cigaretteCount: number): string {
	if (cigaretteCount <= 1) return 'home_cigarettes_oh';

	// Return a random swear word, untranslated.
	return swearWords[Math.floor(Math.random() * swearWords.length)];
}

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
	location?: NavigateOptions<SearchLocationState>;
	pageContext: {
		city: City;
	};
}

export default function CityTemplate(props: CityProps): React.ReactElement {
	const { frequency, setFrequency } = useContext(FrequencyContext);
	const {
		location: routerLocation,
		pageContext: { city },
	} = props;
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

		reverseGeocode(city.gps).then(setReverseGeoName).catch(console.error);

		const sixHoursAgo = new Date();
		sixHoursAgo.setHours(sixHoursAgo.getHours() - 6);
		raceApiPromise(city.gps, {
			aqicn: {
				token: process.env.GATSBY_AQICN_TOKEN as string,
			},
			openaq: {
				dateFrom: sixHoursAgo,
			},
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
			const errorParts = error.message.split('2.');
			if (errorParts.length !== 2) {
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
				title={getSeoTitle(
					api?.shootismoke.dailyCigarettes,
					city.slug,
					reverseGeoName
				)}
			/>

			<Nav />

			<Section noPadding>
				<div className="px-6 md:px-24">
					<SearchBar
						placeholder={
							city.name
								? [city.name, city.adminName, city.country]
										.filter((x) => !!x)
										.join(', ')
								: routerLocation?.state?.cityName ||
								  reverseGeoName ||
								  'Search for any city'
						}
					/>
					<p className="mt-2 type-100 text-gray-600">
						{distance !== undefined ? (
							api?.shootismoke.isAccurate === false ? (
								<Link
									className="text-red hover:underline"
									to="/faq#station-so-far"
								>
									Air Quality Station: {distance}km away
									<img
										alt="warning"
										className="ml-1 inline"
										src={warning}
									/>
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
											{t(swearWord)}! You smoke{' '}
											<span className="text-orange">
												{cigarettes} cigarette
												{cigarettes === 1 ? '' : 's'}
											</span>
										</>
									</H1>
								}
							/>
						</div>

						<div
							className={c(
								'ml-6 md:ml-24',
								'mt-4 overflow-auto flex'
							)}
						>
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
						message={error.message}
					/>
				) : (
					<Loading className="mt-5 px-6 md:px-24" />
				)}
			</Section>

			{primaryPol && aqi && (
				<PollutantSection aqi={aqi} pollutant={primaryPol.parameter} />
			)}

			<RankingSection currentCity={city} />
			<AboutSection />
			<AdSection />
			<FeaturedSection />
			<BlogSection />
			<DownloadSection />
			<Footer />
		</>
	);
}
