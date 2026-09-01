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

import { Pollutant } from '@common/convert';
import type { AxiosError } from 'axios';

import { LatLng } from '../../types';
import { ACCURATE_RADIUS, OpenAQError } from '../../util';
import { fetchAndDecode } from '../../util/fetch';
import {
	OpenAQLatestResponse,
	OpenAQLocation,
	OpenAQLocationsResponse,
	OpenAQMeasurements,
	OpenAQSensorBase,
} from './types';

const OPENAQ_V3 = 'https://api.openaq.org/v3';

/**
 * How many nearby locations to consider before giving up. The nearest station
 * does not always carry the pollutant we want.
 */
const LOCATION_LIMIT = 10;

/**
 * v3 caps the search radius at 25km.
 */
const MAX_RADIUS = 25000;

export interface OpenAQOptions {
	/**
	 * OpenAQ v3 requires an API key on every request, sent as `X-API-Key`.
	 *
	 * @see https://docs.openaq.org/using-the-api/api-key
	 */
	apiKey: string;
	/**
	 * Kept for source compatibility with the v2 client. v3's `/latest`
	 * endpoints have no date filter, so freshness is enforced downstream by
	 * `createApi`, which drops anything older than six hours.
	 */
	dateFrom?: Date;
	/**
	 * Kept for source compatibility with the v2 client. See `dateFrom`.
	 */
	dateTo?: Date;
	/**
	 * How many nearby locations to consider.
	 *
	 * @default 10
	 */
	limit?: number;
	/**
	 * Which pollutants we are willing to accept, most preferred first.
	 *
	 * @default ['pm25']
	 */
	parameter?: Pollutant[];
	/**
	 * Search radius in meters, capped at 25000 by the API.
	 *
	 * @default 10000
	 */
	radius?: number;
}

function formatError(err: AxiosError<OpenAQError>): Error {
	// We have had occasions where the error had an empty response field, so
	// check that the data is populated first. v3 is inconsistent about the
	// shape: `{detail: [...]}` for validation errors, `{detail: "..."}` for a
	// rejected key, and `{message: "..."}` when the header is missing.
	const data = err?.response?.data;

	if (typeof data === 'string') {
		return new Error(data);
	}

	if (data && typeof data === 'object') {
		if ('detail' in data) {
			const { detail } = data;
			return new Error(
				Array.isArray(detail)
					? detail.map((d) => JSON.stringify(d)).join(', ')
					: String(detail)
			);
		}

		if ('message' in data) {
			return new Error(String(data.message));
		}
	}

	return new Error(err?.message ?? JSON.stringify(err));
}

function assertApiKey(options?: OpenAQOptions): string {
	if (!options?.apiKey) {
		throw new Error('OpenAQ requires an apiKey.');
	}

	return options.apiKey;
}

function headers(apiKey: string): Record<string, string> {
	return { 'X-API-Key': apiKey };
}

/**
 * Find the first sensor on `location` measuring one of `wanted`, preferring
 * earlier entries.
 */
function findSensor(
	location: OpenAQLocation,
	wanted: Pollutant[]
): OpenAQSensorBase | undefined {
	for (const parameter of wanted) {
		const sensor = location.sensors.find(
			(s) => s.parameter.name === parameter
		);
		if (sensor) {
			return sensor;
		}
	}

	return undefined;
}

function isFresh(utc: string, dateFrom?: Date): boolean {
	return !dateFrom || new Date(utc).getTime() >= dateFrom.getTime();
}

async function latestForLocation(
	location: OpenAQLocation,
	sensor: OpenAQSensorBase,
	apiKey: string,
	dateFrom?: Date
): Promise<OpenAQMeasurements | undefined> {
	const { results } = await fetchAndDecode<
		OpenAQLatestResponse,
		AxiosError<OpenAQError>
	>(`${OPENAQ_V3}/locations/${location.id}/latest`, {
		formatError,
		headers: headers(apiKey),
	});

	const latest = results.find((r) => r.sensorsId === sensor.id);
	if (!latest || !isFresh(latest.datetime.utc, dateFrom)) {
		return undefined;
	}

	return { latest, location, sensor };
}

export async function fetchByGps(
	gps: LatLng,
	options?: OpenAQOptions
): Promise<OpenAQMeasurements> {
	const apiKey = assertApiKey(options);
	const wanted = options?.parameter?.length ? options.parameter : ['pm25'];
	// v3 truncates beyond 4 decimals of precision.
	const latitude = Math.round(gps.latitude * 10000) / 10000;
	const longitude = Math.round(gps.longitude * 10000) / 10000;
	const radius = Math.min(options?.radius ?? ACCURATE_RADIUS, MAX_RADIUS);

	const { results } = await fetchAndDecode<
		OpenAQLocationsResponse,
		AxiosError<OpenAQError>
	>(
		`${OPENAQ_V3}/locations?coordinates=${latitude},${longitude}` +
			`&radius=${radius}&limit=${options?.limit ?? LOCATION_LIMIT}`,
		{ formatError, headers: headers(apiKey) }
	);

	if (!results.length) {
		throw new Error(
			`No OpenAQ location within ${radius}m of ${latitude},${longitude}`
		);
	}

	// `results` comes back nearest-first. Walk outwards until we find a station
	// that both measures what we want and has actually reported a value.
	for (const location of results) {
		const sensor = findSensor(location, wanted as Pollutant[]);
		if (!sensor) {
			continue;
		}

		// `datetimeLast` is on the search result, so we can skip a station that
		// has gone quiet without paying for its /latest call.
		if (
			location.datetimeLast &&
			!isFresh(location.datetimeLast.utc, options?.dateFrom)
		) {
			continue;
		}

		const measurement = await latestForLocation(
			location,
			sensor,
			apiKey,
			options?.dateFrom
		);
		if (measurement) {
			return measurement;
		}
	}

	throw new Error(
		`No OpenAQ station within ${radius}m of ${latitude},${longitude} has a recent ${wanted.join(
			' or '
		)} reading`
	);
}

export async function fetchByStation(
	stationId: string,
	options?: OpenAQOptions
): Promise<OpenAQMeasurements> {
	const apiKey = assertApiKey(options);
	const wanted = options?.parameter?.length ? options.parameter : ['pm25'];

	// `/locations/{id}` wraps the location in the same `results` array the
	// search endpoint uses.
	const { results } = await fetchAndDecode<
		OpenAQLocationsResponse,
		AxiosError<OpenAQError>
	>(`${OPENAQ_V3}/locations/${stationId}`, {
		formatError,
		headers: headers(apiKey),
	});

	const [location] = results;
	if (!location) {
		throw new Error(`No OpenAQ location with id ${stationId}`);
	}

	const sensor = findSensor(location, wanted as Pollutant[]);
	if (!sensor) {
		throw new Error(
			`OpenAQ station ${stationId} does not measure ${wanted.join(
				' or '
			)}`
		);
	}

	const measurement = await latestForLocation(
		location,
		sensor,
		apiKey,
		options?.dateFrom
	);
	if (!measurement) {
		throw new Error(
			`OpenAQ station ${stationId} has no recent ${wanted.join(
				' or '
			)} reading`
		);
	}

	return measurement;
}
