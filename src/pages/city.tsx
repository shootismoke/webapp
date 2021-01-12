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

import type { LatLng } from '@shootismoke/dataproviders';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import CityTemplate from '../components/layout/city';
import { City, getAllCities } from '../util';

export async function getStaticProps(): Promise<{ props: { cities: City[] } }> {
	const cities = await getAllCities();

	return { props: { cities } };
}

interface CityProps {
	cities: City[];
}

export default function CityPage(props: CityProps): React.ReactElement | null {
	const { cities } = props;
	const router = useRouter();
	const [gps, setGps] = useState<LatLng>();

	useEffect(() => {
		const { lat, lng } = router.query;
		if (!lat || !lng || isNaN(+lat) || isNaN(+lng)) {
			router.push('/404');
		} else {
			setGps({ latitude: +lat, longitude: +lng });
		}
	}, []);

	return gps ? (
		<CityTemplate
			city={{ gps, name: router.query.name as string }}
			cities={cities}
		/>
	) : null;
}
