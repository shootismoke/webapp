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
import React, { useEffect, useState } from 'react';

import { Api, raceApiPromise } from '../util/race';
import { CigaretteBlock } from '../components';

interface City {
	gps: LatLng;
	name: string;
	slug: string;
}

interface CityProps {
	pageContext: {
		city: City;
	};
}

export default function City({ pageContext }: CityProps): React.ReactElement {
	const { city } = pageContext;
	const [api, setApi] = useState<Api | undefined>();

	useEffect(() => {
		raceApiPromise(city.gps, {
			aqicnToken: '',
		})
			.then(setApi)
			.catch(console.error);
	}, []);

	return (
		<div>
			Name: {city.name}
			{api && (
				<CigaretteBlock
					cigarettes={api.shootismoke.dailyCigarettes}
					t={(a) => a}
				/>
			)}
		</div>
	);
}
