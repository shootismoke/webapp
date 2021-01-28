/**
 * This file is part of Sh**t! I Smoke.
 *
 * Copyright (C) 2018-2021  Marcelo S. Coelho, Amaury Martiny.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { LatLng } from '@shootismoke/dataproviders';
import type { Api } from '@shootismoke/ui/lib/util/api';
import axios from 'axios';

export interface City {
	/**
	 * Name of the administration of the city.
	 */
	adminName?: string;
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
	 * Url of a photo of the city.
	 */
	photoUrl?: string;
	/**
	 * City slug in URL, only available when it's a hardcoded city.
	 */
	slug?: string;
}

let cachedCities: City[];

export async function getAllCities(): Promise<City[]> {
	if (cachedCities) {
		return cachedCities;
	}

	// Call an external API endpoint to get all cities. This is done in one of
	// our repos too: shootibot/cities.
	const { data: cities } = await axios.get<City[]>(
		'https://raw.githubusercontent.com/shootibot/cities/master/all.json'
	);

	cachedCities = cities;

	return cities;
}

const REVERSE_API =
	'https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=en';

/**
 * Find the reverse geocoding of an GPS latitude/longitude. Uses bigdatacloud.
 *
 * @see https://www.bigdatacloud.com/geocoding-apis/free-reverse-geocode-to-city-api
 */
export async function reverseGeocode(gps: LatLng): Promise<string> {
	const { data } = await axios.get<{ [key: string]: string }>(
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
