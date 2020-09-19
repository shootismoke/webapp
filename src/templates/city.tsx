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
// along with Sh**t! I Smoke.  If not, see <http://www.gnu.org/licenses/>.

import { NavigateOptions } from '@reach/router';
import { convert } from '@shootismoke/convert';
import {
	Api,
	BoxButton,
	Cigarettes,
	CigarettesText,
	distanceToStation,
	FrequencyContext,
	raceApiPromise,
} from '@shootismoke/ui';
import c from 'classnames';
import React, { useContext, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import {
	City,
	DownloadSection,
	FeaturedSection,
	Footer,
	HealthSection,
	HowSection,
	Nav,
	PollutantSection,
	reverseGeocode,
	SearchBar,
	SearchLocationState,
	Section,
	SectionDivider,
	sectionHorizontalPadding,
	Seo,
} from '../components';

interface CityProps {
	location?: NavigateOptions<SearchLocationState>;
	pageContext: {
		city: City;
	};
}

/**
 * Depending on how many we show, decide on the size of one cigarette.
 *
 * @param cigarettes - The cigarettes count.
 */
function fullCigaretteLength(cigarettes: number): number {
	if (cigarettes <= 1) {
		return 150;
	} else if (cigarettes <= 4) {
		return 200;
	} else if (cigarettes <= 59) {
		// Empirically, 59 cigarettes of length 120 fit into 1 line.
		return 120;
	} else {
		return 50;
	}
}

/**
 * Capitalize a string.
 *
 * @param s - The string to capitalize
 */
function capitalize(s: string): string {
	return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Decide on a SEO title for the page.
 */
function getSeoTitle(
	cigarettes?: number,
	slug?: string,
	reverseGeoName?: string
): string {
	if (!cigarettes) {
		return slug
			? `${capitalize(slug)} Air Pollution`
			: `City Air Pollution`;
	}

	// Round to 1 decimal
	const cigarettesRounded = Math.round(cigarettes * 10) / 10;

	return slug
		? `${capitalize(slug)} Air Pollution: ${cigarettesRounded} cigarettes`
		: `${reverseGeoName} Air Pollution: ${cigarettesRounded} cigarettes`;
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

	useEffect(() => {
		setError(undefined);

		raceApiPromise(city.gps, {
			aqicnToken: process.env.AQICN_TOKEN as string,
		})
			.then(setApi)
			.catch(setError);
	}, [city.gps]);

	useEffect(() => {
		reverseGeocode(city.gps).then(setReverseGeoName).catch(console.error);
	}, [city.gps]);

	const cigarettes = api
		? api.shootismoke.dailyCigarettes *
		  (frequency === 'daily' ? 1 : frequency === 'weekly' ? 7 : 30)
		: undefined;

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
				{api && (
					<p className="mt-2 text-gray-600 text-xs">
						Air Quality Station: {distanceToStation(city.gps, api)}
						km away
					</p>
				)}
			</Section>

			<Section noPadding>
				{cigarettes ? (
					<div className="'lg:flex lg:items-center'">
						<div
							className={c(
								sectionHorizontalPadding,
								'flex lg:justify-start h-32'
							)}
						>
							<Cigarettes
								cigarettes={cigarettes}
								fullCigaretteLength={fullCigaretteLength(
									cigarettes
								)}
								showMaxCigarettes={200}
								style={{
									maxHeight: '128px',
									// This is so that horizontal cigarettes wrap correctly.
									maxWidth:
										cigarettes <= 4 ? '300px' : '100%',
									overflow: 'hidden',
								}}
							/>
						</div>

						<div
							className={c(
								sectionHorizontalPadding,
								'mt-8 text-3xl'
							)}
						>
							<CigarettesText
								cigarettes={cigarettes}
								t={(id, replace): string => t({ id }, replace)}
								style={{
									// If only we could add `className="lg:text-3xl"`...
									// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
									// @ts-ignore
									fontSize:
										typeof window !== 'undefined' &&
										window.innerWidth >= 1024
											? '3rem'
											: '2.25rem',
								}}
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
											active={frequency === f}
											onPress={(): void =>
												setFrequency(f)
											}
										>
											{f}
										</BoxButton>
									</div>
								)
							)}
						</div>
					</div>
				) : error ? (
					<p className={c(sectionHorizontalPadding, 'text-red')}>
						ERROR: {error.message}
					</p>
				) : (
					<p className={c(sectionHorizontalPadding)}>Loading...</p>
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
							.sort((a, b) => a - b)[0]
					}
				/>
			)}

			<SectionDivider title="Most cigarettes near you" />

			<HowSection />
			<FeaturedSection />
			<DownloadSection />
			<Footer />
		</>
	);
}
