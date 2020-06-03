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
import { Api, CigaretteBlock, raceApiPromise } from '@shootismoke/ui';
import React, { useEffect, useState } from 'react';

import { Featured, Footer, HowSection, Nav } from '../components';

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

export default function CityTemplate(props: CityProps): React.ReactElement {
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

	return (
		<>
			<Nav showSearchBar />
			<section className="container mx-auto my-12 px-24">
				<h1>Name: {city.name}</h1>
				{api ? (
					<CigaretteBlock
						cigarettes={api.shootismoke.dailyCigarettes}
						t={(a): string => a}
					/>
				) : (
					<p>Loading...</p>
				)}
			</section>

			<section className="container mx-auto my-12 px-24">
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
