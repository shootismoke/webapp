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

import { LatLng } from '@shootismoke/dataproviders';
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

import { Featured, Footer, HowSection, Nav, SearchBar } from '../components';

export interface City {
	gps: LatLng;
	name?: string;
	slug: string;
}

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
		pageContext: { city },
	} = props;
	const [api, setApi] = useState<Api | undefined>();

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
			<section className="container mx-auto my-12 px-24">
				<SearchBar />
			</section>

			<section className="container mx-auto my-12 px-24">
				<h1 className="mb-12 text-xl">
					<span className="text-orange">Location:</span> {city.name}
				</h1>
				{cigarettes ? (
					<div className="flex items-center">
						<Cigarettes
							cigarettes={cigarettes}
							fullCigaretteLength={fullCigaretteLength(
								cigarettes
							)}
							showMaxCigarettes={60}
							style={{ width: 300 }}
						/>
						<div className="flex-1 ml-12">
							<CigarettesText
								cigarettes={cigarettes}
								t={(id, replace): string => t({ id }, replace)}
							/>
							<div className="flex">
								{(['daily', 'weekly', 'monthly'] as const).map(
									(f) => (
										<div
											className="mx-2 w-1/4 cursor-pointer"
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
			</section>

			<section className="container mx-auto my-12 px-24 text-center">
				<div>
					<h2 className="text-xl">
						The main pollutant is{' '}
						<strong>
							{
								api?.normalized.sort(
									(a, b) => a.value - b.value
								)[0].parameter
							}
						</strong>
						.
					</h2>
					It&apos;s unhealthy because of reasons.
				</div>
				<div>
					<h2 className="text-xl">You should wear a mask.</h2>
					It&apos;s better.
				</div>
			</section>

			<HowSection />
			<Featured />
			<Footer />
		</>
	);
}
