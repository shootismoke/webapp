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
	HowSection,
	Nav,
	SearchBar,
	Section,
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

export default function CityTemplate(props: CityProps): React.ReactElement {
	const { frequency, setFrequency } = useContext(FrequencyContext);
	const { formatMessage: t } = useIntl();
	const {
		pageContext: { api: baseApi, city },
	} = props;
	const [api, setApi] = useState<Api | undefined>(baseApi);

	useEffect(() => {
		raceApiPromise(city.gps, {
			aqicnToken: '',
		})
			.then(setApi)
			.catch(console.error);
	}, [city.gps]);

	const cigarettes = api
		? api.shootismoke.dailyCigarettes *
		  (frequency === 'daily' ? 1 : frequency === 'weekly' ? 7 : 30)
		: undefined;

	return (
		<>
			<Nav />
			<Section>
				<SearchBar />
			</Section>

			<Section>
				<CurrentLocation city={city} />
				{cigarettes ? (
					<div className="lg:flex lg:items-center">
						<div className="flex lg:w-1/4 lg:justify-end">
							<Cigarettes
								cigarettes={cigarettes}
								fullCigaretteLength={fullCigaretteLength(
									cigarettes
								)}
								showMaxCigarettes={60}
								style={{ maxWidth: 300 }}
							/>
						</div>

						<div className="lg:flex-1 lg:ml-12">
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
				) : (
					<p>Loading...</p>
				)}
			</Section>

			<Section className="text-center">
				<div>
					<h2 className="font-gotham-black text-3xl">
						The main pollutant is{' '}
						<strong className="text-orange">
							{api?.normalized
								.sort((a, b) => a.value - b.value)[0]
								.parameter.toUpperCase()}
						</strong>
						.
					</h2>
					It&apos;s unhealthy because of reasons.
				</div>
				<div>
					<h2 className="font-gotham-black text-3xl">
						You should{' '}
						<span className="text-orange">wear a mask</span>.
					</h2>
					It&apos;s better.
				</div>
			</Section>

			<HowSection />
			<FeaturedSection />
			<Footer />
		</>
	);
}
