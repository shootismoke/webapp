import {
	LatLng,
	Normalized,
	OpenAQFormat,
	ProviderPromise,
} from '@shootismoke/dataproviders';
import { aqicn, openaq } from '@shootismoke/dataproviders/lib/promise';
import promiseAny, { AggregateError } from 'p-any';

/**
 * Api is basically the normalized data from '@shootismoke/dataproviders',
 * where we make sure to add cigarette conversion
 */
export interface Api {
	normalized: Normalized;
	pm25: OpenAQFormat;
	shootismoke: {
		dailyCigarettes: number;
	};
}

/**
 * Convert raw pm25 level to number of cigarettes. 1 cigarette is equivalent of
 * a PM2.5 level of 22ug/m3.
 *
 * @see http://berkeleyearth.org/air-pollution-and-cigarette-equivalence/
 * @param rawPm25 - The raw PM2.5 level, in ug/m3
 */
export function pm25ToCigarettes(rawPm25: number): number {
	return rawPm25 / 22;
}

/**
 * Given some normalized data points, filter out the first one that contains
 * pm25 data. Returns a TaskEither left is none is found, or format the data
 * into the Api interface
 *
 * @param normalized - The normalized data to process
 */
function filterPm25(normalized: Normalized): Api {
	const pm25 = normalized.filter(({ parameter }) => parameter === 'pm25');

	if (pm25.length) {
		return {
			normalized,
			pm25: pm25[0],
			shootismoke: {
				dailyCigarettes: pm25ToCigarettes(pm25[0].value),
			},
		};
	} else {
		throw new Error(
			`Station ${normalized[0].location} does not have PM2.5 measurings right now`
		);
	}
}

/**
 * Options to be passed into the `raceApi` function.
 */
interface RaceApiOptions {
	/**
	 * The token for fetching aqicn data.
	 */
	aqicnToken: string;
}

/**
 * Fetch data parallely from difference data sources, and return the first
 * response
 *
 * @param gps - The GPS coordinates to fetch data for
 */
export function raceApiPromise(
	gps: LatLng,
	options: RaceApiOptions
): Promise<Api> {
	// Helper function to fetch & normalize data for 1 provider
	async function fetchForProvider<DataByGps, DataByStation, Options>(
		provider: ProviderPromise<DataByGps, DataByStation, Options>,
		options?: Options
	): Promise<Api> {
		const data = await provider.fetchByGps(gps, options);
		const normalized = provider.normalizeByGps(data);
		console.log(
			`<ApiContext> Got data from ${provider.id}: ${JSON.stringify(
				normalized
			)}`
		);

		return filterPm25(normalized);
	}

	// Run these tasks parallely
	const tasks = [
		fetchForProvider(aqicn, {
			token: options.aqicnToken,
		}),
		fetchForProvider(openaq, {
			limit: 1,
			parameter: ['pm25'],
		}),
	];

	// Not sure how to fix these eslint errors.
	return promiseAny(tasks).catch((errors: AggregateError) => {
		// Transform an AggregateError into a JS native Error
		const aggregateMessage = [...errors]
			.map(({ message }, index) => `${index + 1}. ${message}`)
			.join('. ');

		throw new Error(aggregateMessage);
	});
}
