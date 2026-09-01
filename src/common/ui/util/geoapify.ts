// Sh**t! I Smoke
// Copyright (C) 2018-2026  Marcelo S. Coelho, Amaury.

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

import { LatLng } from '@common/dataproviders';
import retry from 'async-retry';
import axios from 'axios';

export interface GeoapifyRes {
	city?: string;
	country?: string;
	formatted: string;
	lat: number;
	lon: number;
	state?: string;
}

/**
 * For docs, see https://apidocs.geoapify.com/playground/geocoding and
 * and https://apidocs.geoapify.com/docs/geocoding/forward-geocoding/#about
 */
function getEndpoint(search: string, apiKey: string, gps?: LatLng): string {
	const base = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
		search
	)}&limit=10&format=json&apiKey=${apiKey}`;

	if (gps) {
		return base + `&bias=proximity:${gps.longitude},${gps.latitude}`;
	}

	return base;
}

export async function geoapify(
	search: string,
	apiKey: string,
	gps?: LatLng
): Promise<GeoapifyRes[]> {
	return retry(
		async () => {
			const {
				data: { results },
			} = await axios.get<{ results: GeoapifyRes[] }>(
				getEndpoint(search, apiKey, gps),
				{
					timeout: 5000,
				}
			);

			return results;
		},
		{
			retries: 2,
		}
	);
}
