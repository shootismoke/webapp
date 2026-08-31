// Sh**t! I Smoke
// Copyright (C) 2018-2021  Marcelo S. Coelho, Amaury M.

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

import { round as roundBase, ugm3 } from '@common/convert';
import type {
	AqicnOptions,
	LatLng,
	OpenAQOptions,
	OpenAQResult,
	OpenAQResults,
	Provider,
} from '@common/dataproviders';
import { aqicn, openaq } from '@common/dataproviders';
import { differenceInHours, subHours } from 'date-fns';
import debug from 'debug';
import promiseAny, { AggregateError } from 'p-any';

import { pm25ToCigarettes } from './secretSauce';
import { distanceToStation, isStationTooFar } from './station';

const l = debug('shootismoke:ui:api');

/**
 * Api is basically the normalized data from '@common/dataproviders',
 * where we make sure to add cigarette conversion. An API is returned only when
 * there is PM2.5 data (even inacurrate.)
 */
export interface Api {
	/**
	 * All results (normalized) returned by the provider.
	 */
	results: OpenAQResults;
	/**
	 * Raw data corresponding to the PM2.5 pollutant.
	 */
	pm25: OpenAQResult;
	/**
	 * Data used by shootismoke frontends.
	 */
	shootismoke: {
		/**
		 * The amount of cigarettes converted from the PM2.5 level.
		 */
		dailyCigarettes: number;
		/**
		 * The distance to the closest station where PM2.5 level can be
		 * measured.
		 */
		distanceToStation: number;
		/**
		 * Whether the pm25 level is accuruate. This happens when the station
		 * from which the measurement took place is not too far.
		 */
		isAccurate: boolean;
	};
}

/**
 * Round a number to 1 decimal. Useful for showing cigarettes on the home page.
 *
 * @param n - The number to round;
 */
export function round(n: number): number {
	return roundBase(n, 1);
}
/**
 * We show pm25 results within this number of hours. More than this, we
 * consider the results as inaccurate.
 */
const RESULTS_WITHIN_HOURS = 6;

/**
 * Given some results data points, and the current GPS, construct an API
 * object with sanitized data.
 *
 * @param results - The results results data to process
 */
export function createApi(
	gps: LatLng,
	results: OpenAQResults,
	now = new Date()
): Api {
	const sanitizedResults = results
		// From the results results, remove the entries that are too old.
		.filter(
			({ date }) =>
				Math.abs(differenceInHours(new Date(date.utc), now)) <=
				RESULTS_WITHIN_HOURS
		)
		// Remove the entries that are negative (happens on openaq).
		.filter(({ value }) => value >= 0);
	// Filter pm25 pollutants with the correct unit.
	const pm25 = sanitizedResults.filter(
		({ parameter, unit }) => parameter === 'pm25' && unit === ugm3
	);

	// TODO We can also sort the pm25 array by closest to `gps`.

	if (pm25.length) {
		return {
			results: sanitizedResults as OpenAQResults, // We're sure there's at least one item in `sanitizedResults`.
			pm25: pm25[0],
			shootismoke: {
				dailyCigarettes: pm25ToCigarettes(pm25[0].value),
				distanceToStation: distanceToStation(gps, pm25[0]),
				isAccurate: !isStationTooFar(gps, pm25[0]),
			},
		};
	} else {
		throw new Error(
			`Station ${results[0].location} does not have PM2.5 measurings right now`
		);
	}
}

/**
 * Helper function to fetch & normalize data for 1 provider.
 */
async function fetchForProvider<Response, Options>(
	gps: LatLng,
	provider: Provider<Response, Options>,
	options?: Options
): Promise<OpenAQResults> {
	const data = await provider.fetchByGps(gps, options);
	const results = provider.normalize(data);
	l(`Got data from ${provider.id}: ${JSON.stringify(results)}`);

	return results;
}

/**
 * Options to be passed into the {@link raceApiPromise} function.
 */
interface RaceApiOptions {
	aqicn?: AqicnOptions;
	openaq?: OpenAQOptions;
}

/**
 * Fetch data parallely from difference data sources, and return the first
 * response as an {@link Api} format.
 *
 * @param gps - The GPS coordinates to fetch data for
 */
export function raceApiPromise(
	gps: LatLng,
	options: RaceApiOptions
): Promise<Api> {
	const now = new Date();

	// Run these tasks parallely
	const tasks = [
		fetchForProvider(gps, aqicn, options.aqicn).then((results) =>
			createApi(gps, results)
		),
		fetchForProvider(gps, openaq, {
			dateFrom: subHours(now, RESULTS_WITHIN_HOURS),
			...options.openaq,
		}).then((results) => createApi(gps, results)),
	];

	return promiseAny(tasks).catch((errors: AggregateError) => {
		// Transform an AggregateError into a JS native Error
		const aggregateMessage = [...errors]
			.map(({ message }, index) => `${index + 1}. ${message}`)
			.join('. ');

		throw new Error(aggregateMessage);
	});
}
