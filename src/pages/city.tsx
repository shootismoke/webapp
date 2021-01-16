/*
    This file is part of Sh**t! I Smoke.
    Copyright (C) 2018-2021  Marcelo S. Coelho, Amaury Martiny
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.
    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import type { LatLng } from '@shootismoke/dataproviders';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import CityTemplate from '../frontend/components/layout/city';
import { City, getAllCities, sentryException } from '../frontend/util';

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
			router.push('/404').catch(sentryException);
		} else {
			setGps({ latitude: +lat, longitude: +lng });
		}
	}, [router]);

	return gps ? (
		<CityTemplate
			city={{ gps, name: router.query.name as string }}
			cities={cities}
		/>
	) : null;
}
