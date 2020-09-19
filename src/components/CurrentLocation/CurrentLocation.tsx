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
import { Api } from '@shootismoke/ui';
import axios from 'axios';

export interface City {
	api?: Api;
	/**
	 * City country, only available when it's a hardcoded city.
	 */
	country?: string;
	gps: LatLng;
	/**
	 * City name, only available when it's a hardcoded city.
	 */
	name?: string;
	/**
	 * City slug in URL, only available when it's a hardcoded city.
	 */
	slug?: string;
}

const REVERSE_API =
	'https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=en';

/**
 * Find the reverse geocoding of an GPS latitude/longitude. Uses bigdatacloud.
 *
 * @see https://www.bigdatacloud.com/geocoding-apis/free-reverse-geocode-to-city-api
 */
export async function reverseGeocode(gps: LatLng): Promise<string> {
	const { data } = await axios.get(
		`${REVERSE_API}&latitude=${gps.latitude}&longitude=${gps.longitude}`
	);

	return [
		data.locality,
		data.city,
		data.principalSubdivision,
		data.countryName,
	]
		.filter((x) => !!x)
		.join(', ');
}
