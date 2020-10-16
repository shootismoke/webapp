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

import { NavigateOptions } from '@reach/router';
import {
	Api,
	BoxButton,
	distanceToStation,
	FrequencyContext,
	getSwearWord,
	raceApiPromise,
	round,
} from '@shootismoke/ui';
import c from 'classnames';
import React, { useContext, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import warning from '../../assets/images/icons/warning_red.svg';
import {
	Cigarettes,
	DownloadSection,
	FeaturedSection,
	Footer,
	H1,
	HealthSection,
	HeroLayout,
	HowSection,
	Loading,
	Nav,
	PollutantSection,
	RankingSection,
	SadFace,
	SearchBar,
	SearchLocationState,
	Section,
	sectionHorizontalPadding,
	Seo,
} from '../components';
import {
	City,
	getAQI,
	getSeoTitle,
	primaryPollutant,
	reverseGeocode,
} from '../util';

interface CityProps {
	location?: NavigateOptions<SearchLocationState>;
	pageContext: {
		city: City;
	};
}

export default function CityTemplate(props: CityProps): React.ReactElement {
	const { frequency, setFrequency } = useContext(FrequencyContext);
	const { formatMessage: t } = useIntl();
	const {
		location: routerLocation,
		pageContext: { city },
	} = props;
	const [api, setApi] = useState<Api | undefined>(city.api);
	const [error, setError] = useState<Error>();
	const [reverseGeoName, setReverseGeoName] = useState(city.name);

	// Evertime we change city, reset, and fetch new values.
	useEffect(() => {
		// If we already loaded the city's cigarettes, don't load it again.
		// For example, if the city's api is loaded statically, then we don;t
		// show "Loading..." again.
		if (
			city.api?.shootismoke.dailyCigarettes !==
			api?.shootismoke.dailyCigarettes
		) {
			setApi(undefined);
		}

		setError(undefined);
		setReverseGeoName(undefined);

		reverseGeocode(city.gps).then(setReverseGeoName).catch(console.error);

		const sixHoursAgo = new Date();
		sixHoursAgo.setHours(sixHoursAgo.getHours() - 6);
		raceApiPromise(city.gps, {
			aqicn: {
				aqicnToken: process.env.GATSBY_AQICN_TOKEN as string,
			},
			openaq: {
				dateFrom: sixHoursAgo,
			},
		})
			.then(setApi)
			.catch(setError);
	}, [city]); // eslint-disable-line react-hooks/exhaustive-deps

	// Number of cigarettes to display.
	const cigarettes = api
		? api.shootismoke.dailyCigarettes *
		  (frequency === 'daily' ? 1 : frequency === 'weekly' ? 7 : 30)
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
			<Section>
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
				<p
					className={c(
						'mt-2 text-gray-600 text-xs h-2',
						api?.shootismoke.isAccurate === false && 'text-red'
					)}
				>
					{distance
						? `Air Quality Station: ${distance}km away`
						: null}
					{api?.shootismoke.isAccurate === false && (
						<img
							alt="warning"
							className="ml-1 inline"
							src={warning}
						/>
					)}
				</p>
			</Section>

			<Section className="pt-6" noPadding>
				{cigarettes && swearWord ? (
					<>
						<div className={sectionHorizontalPadding}>
							<HeroLayout
								cover={<Cigarettes cigarettes={cigarettes} />}
								title={
									<H1>
										<>
											{t({ id: swearWord })}! You smoke
											<br />
											<span className="text-orange">
												{round(cigarettes)} cigarette
												{cigarettes === 1 ? '' : 's'}
											</span>
										</>
									</H1>
								}
							/>
						</div>

						{/** Same as sectionHorizontalPadding, but only left. */}
						<div className="mt-4 ml-6 sm:ml-12 md:ml-24 pb-2 overflow-auto flex">
							{(['daily', 'weekly', 'monthly'] as const).map(
								(f) => (
									<div
										className="mr-3 cursor-pointer"
										key={f}
									>
										<BoxButton
											onPress={(): void =>
												setFrequency(f)
											}
										>
											<p
												className={c(
													'font-extrabold text-4xl',
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
						className={sectionHorizontalPadding}
						message={error.message}
					/>
				) : (
					<Loading className={sectionHorizontalPadding} />
				)}
			</Section>

			{primaryPol && (
				<PollutantSection pollutant={primaryPol.parameter} />
			)}

			{aqi && <HealthSection aqi={aqi} />}

			<RankingSection currentCity={city} />
			<HowSection />
			<FeaturedSection />
			<DownloadSection />
			<Footer />
		</>
	);
}
