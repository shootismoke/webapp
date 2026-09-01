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

import { ACCURATE_RADIUS, LatLng, OpenAQResult } from '@common/dataproviders';
import haversine from 'haversine';

/**
 * Capitalize a string.
 *
 * @param s - The string to capitalize
 */
export function capitalize(s: string): string {
	return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * We can show distances in these two units.
 */
export type DistanceUnit = 'km' | 'mile';

/**
 * Above this distance (km), we consider the station too far from the user
 */
export const MAX_DISTANCE_TO_STATION = ACCURATE_RADIUS / 1000;

/**
 * Station given by the AQICN API is fucked up. Sometimes it's [lat, lng],
 * sometimes it's [lng, lat].
 * We check here with the user's real currentLocation coordinates, and take the
 * "closest" one.
 *
 * @param currentLocation - An object containing {latitude, longitude}
 * representing the user's current location.
 * @param station - An object containing {latitude, longitude} representing
 * the station's location.
 */
export function getCorrectLatLng(
	currentLocation: LatLng,
	station: LatLng
): LatLng {
	const d1 =
		Math.abs(currentLocation.latitude - station.latitude) +
		Math.abs(currentLocation.longitude - station.longitude);

	const d2 =
		Math.abs(currentLocation.latitude - station.longitude) +
		Math.abs(currentLocation.longitude - station.latitude);

	if (d1 < d2) return station;
	return {
		...station,
		latitude: station.longitude,
		longitude: station.latitude,
	};
}

/**
 * Get distance from current location to station.
 *
 * @param currentLocation - The current location of the user.
 * @param api - The api object returned by remote data.
 * @param unit - The unit of measure returned.
 */
export function distanceToStation(
	currentLocation: LatLng,
	pm25Measurement: OpenAQResult,
	unit: DistanceUnit = 'km'
): number {
	// This case should be very rare, only happens on OpenAQ that sometimes,
	// the `coordinates` field isn't returned. This field is actually optional
	// in the OpenAQ format.
	// FIXME Return something better than 0?
	if (!pm25Measurement.coordinates) {
		return 0;
	}

	return Math.round(
		haversine(
			currentLocation,
			getCorrectLatLng(currentLocation, pm25Measurement.coordinates),
			{ unit }
		)
	);
}

/**
 * Returns true if the station is at more than {@link MAX_DISTANCE_TO_STATION}
 * kilometers away from the current location.
 *
 * @param currentLocation - The current location of the user.
 * @param api - The api object returned by remote data.
 */
export function isStationTooFar(
	currentLocation: LatLng,
	pm25Measurement: OpenAQResult
): boolean {
	return (
		distanceToStation(currentLocation, pm25Measurement) >
		MAX_DISTANCE_TO_STATION
	);
}
