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
import { convert } from '@shootismoke/convert';
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

import {
	Cigarettes,
	DownloadSection,
	FeaturedSection,
	Footer,
	H1,
	HealthSection,
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
import { City, getSeoTitle, reverseGeocode } from '../util';
import warning from '../../assets/images/icons/warning_red.svg';


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
		setApi(undefined);
		setError(undefined);
		setReverseGeoName(undefined);

		reverseGeocode(city.gps).then(setReverseGeoName).catch(console.error);

		raceApiPromise(city.gps, {
			aqicnToken: process.env.GATSBY_AQICN_TOKEN as string,
		})
			.then(setApi)
			.catch(setError);
	}, [city.gps]);

	// Number of cigarettes to display.
	const cigarettes = api
		? api.shootismoke.dailyCigarettes *
		  (frequency === 'daily' ? 1 : frequency === 'weekly' ? 7 : 30)
		: undefined;

	const distance = api ? distanceToStation(city.gps, api) : 0;

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
						city.name ||
						routerLocation?.state?.cityName ||
						reverseGeoName ||
						'Search for any city'
					}
				/>
				<p
					className={c(
						'mt-2 text-gray-600 text-xs h-2',
						distance > 15 && 'text-red' 
					)}
				>
					{distance
						? `Air Quality Station: ${distance}km away`
						: null}
					{distance >15 && <img alt="warning" className="ml-1 inline" src={warning}/>}
				</p>
			</Section>

			<Section className="pt-6" noPadding>
				{cigarettes ? (
					<>
						<div className={c(sectionHorizontalPadding, 'h-32')}>
							<Cigarettes cigarettes={cigarettes} />
						</div>

						<div className={c(sectionHorizontalPadding, 'mt-4')}>
							<H1>
								<>
									{t({ id: getSwearWord(cigarettes) })}! You
									smoke
									<br />
									<span className="text-orange">
										{round(cigarettes)} cigarette
										{cigarettes === 1 ? '' : 's'}
									</span>
								</>
							</H1>
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

			{api && (
				<PollutantSection
					pollutant={
						api.normalized
							.map(({ parameter, value }) => ({
								parameter,
								value: convert(
									parameter,
									'raw',
									'usaEpa',
									value
								),
							}))
							.sort((a, b) => a.value - b.value)[0].parameter
					}
				/>
			)}

			{api && (
				<HealthSection
					aqi={
						api.normalized
							.map(({ parameter, value }) =>
								convert(parameter, 'raw', 'usaEpa', value)
							)
							.sort((a, b) => b - a)[0]
					}
				/>
			)}

			<RankingSection />
			<HowSection />
			<FeaturedSection />
			<DownloadSection />
			<Footer />
		</>
	);
}
