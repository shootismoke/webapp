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
import haversine from 'haversine';

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
	// our repos too: shootbot/cities.
	const { data: cities } = await axios.get<City[]>(
		'https://gitlab.com/shootbot/cities/-/blob/master/all.json'
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

/**
 * Given the current city's GPS, find the `nCitiesToShow` closest cities in the
 * `cities` array.
 *
 * @param cities - The array of all cities we have/
 * @param currentGps - The GPS to rank all cities against.
 * @param nCitiesToShow - The number of cities to slice.
 */
export function rankClosestCities(
	cities: City[],
	currentGps: LatLng,
	nCitiesToShow: number
): City[] {
	// We naively calculate the distance from our current city to all the
	// other cities in the database.
	const distances = cities
		.map((city) => ({
			city,
			distance: haversine(currentGps, city.gps),
		}))
		.filter(({ distance }) => distance !== 0) // Remove current city.
		.filter(
			({ city }) => city.api && city.api.shootismoke.isAccurate // Filter out cities with inaccurate API.
		);

	// We then sort the distances.
	distances.sort((a, b) => a.distance - b.distance);

	// We take the CITIES_TO_SHOW first cities.
	const citiesToShow = distances
		.slice(0, nCitiesToShow)
		.map(({ city }) => city);

	// We sort these cities again, this time by cigarettes.
	citiesToShow.sort((a, b) => {
		if (!a.api || !b.api) {
			throw new Error(
				'We already filtered out the Apis that were not undefined. qed.'
			);
		}

		return (
			b.api?.shootismoke.dailyCigarettes -
			a.api?.shootismoke.dailyCigarettes
		);
	});

	return citiesToShow;
}
