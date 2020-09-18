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
	Section,
	SectionDivider,
	sectionHorizontalPadding,
	Seo,
} from '../components';

interface CityProps {
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
	if (cigarettes <= 4) {
		return 150;
	} else if (cigarettes <= 15) {
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
	name?: string
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
		: `${name} Air Pollution: ${cigarettesRounded} cigarettes`;
}

export default function CityTemplate(props: CityProps): React.ReactElement {
	const { frequency, setFrequency } = useContext(FrequencyContext);
	const { formatMessage: t } = useIntl();
	const {
		pageContext: { city },
	} = props;
	const [api, setApi] = useState<Api | undefined>(city.api);
	const [error, setError] = useState<Error>();
	const [name, setName] = useState(city.name);

	useEffect(() => {
		setError(undefined);

		raceApiPromise(city.gps, {
			aqicnToken: process.env.AQICN_TOKEN as string,
		})
			.then(setApi)
			.catch(setError);
	}, [city.gps]);

	useEffect(() => {
		reverseGeocode(city.gps).then(setName).catch(console.error);
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
					name
				)}
			/>

			<Nav />
			<Section>
				<SearchBar />
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
								'flex lg:flex-auto lg:justify-end h-32'
							)}
						>
							<Cigarettes
								cigarettes={cigarettes}
								fullCigaretteLength={fullCigaretteLength(
									cigarettes
								)}
								showMaxCigarettes={60}
								style={{
									// If only we could add `className="lg:justify-end"`...
									justifyContent:
										typeof window !== 'undefined' &&
										window.innerWidth >= 1024 &&
										cigarettes <= 14
											? ('flex-end' as const)
											: undefined,
									// This is so that horizontal cigarettes wrap correctly.
									maxWidth: 300,
								}}
							/>
						</div>

						<div className="lg:flex-auto lg:ml-12">
							<div className={sectionHorizontalPadding}>
								<CigarettesText
									cigarettes={cigarettes}
									t={(id, replace): string =>
										t({ id }, replace)
									}
								/>
							</div>

							{/** Same as sectionHorizontalPadding, but only left. */}
							<div className="mt-4 ml-6 sm:ml-12 md:pm-24 pb-2 w-full overflow-auto flex">
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
