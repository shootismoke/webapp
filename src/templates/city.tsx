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
	FrequencyContext,
	raceApiPromise,
} from '@shootismoke/ui';
import React, { useContext, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import {
	City,
	CurrentLocation,
	FeaturedSection,
	Footer,
	HealthSection,
	HowSection,
	Nav,
	PollutantSection,
	SearchBar,
	Section,
	Seo,
} from '../components';

interface CityProps {
	pageContext: {
		api?: Api;
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
		return 200;
	} else if (cigarettes <= 15) {
		return 150;
	} else {
		return 100;
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
function getSeoTitle(cigarettes?: number, slug?: string): string {
	if (!cigarettes) {
		return slug
			? `${capitalize(slug)} Air Pollution`
			: 'City Air Pollution';
	}

	// Round to 1 decimal
	const cigarettesRounded = Math.round(cigarettes * 10) / 10;

	return slug
		? `${capitalize(slug)} Air Pollution: ${cigarettesRounded} cigarettes`
		: `City Air Pollution: ${cigarettesRounded} cigarettes`;
}

export default function CityTemplate(props: CityProps): React.ReactElement {
	const { frequency, setFrequency } = useContext(FrequencyContext);
	const { formatMessage: t } = useIntl();
	const {
		pageContext: { api: baseApi, city },
	} = props;
	const [api, setApi] = useState<Api | undefined>(baseApi);
	const [error, setError] = useState<Error>();

	useEffect(() => {
		setError(undefined);

		raceApiPromise(city.gps, {
			aqicnToken: '',
		})
			.then(setApi)
			.catch(setError);
	}, [city.gps]);

	const cigarettes = api
		? api.shootismoke.dailyCigarettes *
		  (frequency === 'daily' ? 1 : frequency === 'weekly' ? 7 : 30)
		: undefined;

	return (
		<>
			<Seo
				title={getSeoTitle(api?.shootismoke.dailyCigarettes, city.slug)}
			/>

			<Nav />
			<Section>
				<SearchBar />
			</Section>

			<Section>
				<CurrentLocation city={city} />
				{cigarettes ? (
					<div className="lg:flex lg:items-center">
						<div className="flex lg:flex-auto lg:justify-end">
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
							<div>
								<CigarettesText
									cigarettes={cigarettes}
									t={(id, replace): string =>
										t({ id }, replace)
									}
								/>
							</div>

							<div className="mt-4 flex">
								{(['daily', 'weekly', 'monthly'] as const).map(
									(f) => (
										<div
											className="mx-2 cursor-pointer"
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
					<p className="text-red">ERROR: {error.message}</p>
				) : (
					<p>Loading...</p>
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

			<HowSection />
			<FeaturedSection />
			<Footer />
		</>
	);
}
