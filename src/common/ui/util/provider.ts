import { aqicn, openaq, waqi } from '@common/dataproviders';
import retry, { Options } from 'async-retry';

import type { Api } from './api';
import { createApi } from './api';

const AllProviders = ['aqicn', 'openaq', 'waqi'] as const;
type AllProviders = 'aqicn' | 'openaq' | 'waqi';

/**
 * Given some normalized data points, filter out the first one that contains
 * pm25 data. Returns a TaskEither left is none is found, or format the data
 * into the Api interface
 *
 */
async function providerFetch(
	provider: AllProviders,
	station: string
): Promise<Api> {
	const results =
		provider === 'aqicn'
			? aqicn.normalize(
					await aqicn.fetchByStation(station, {
						token: process.env.BACKEND_AQICN_TOKEN as string,
					})
			  )
			: provider === 'waqi'
			? waqi.normalize(await waqi.fetchByStation(station))
			: openaq.normalize(
					await openaq.fetchByStation(station, {
						limit: 1,
						parameter: ['pm25'],
					})
			  );

	// Gps coordinates are irrelevant for expo report.
	return createApi({ latitude: 0, longitude: 0 }, results);
}

function assertKnownProvider(
	provider: string,
	stationId: string
): asserts provider is AllProviders {
	if (!AllProviders.includes(provider as AllProviders)) {
		throw new Error(`Unrecognized stationId "${stationId}".`);
	}
}

/**
 * Fetch data from correct provider, based on stationId.
 *
 * @param stationId - The stationId of the station
 */
export function fetchStationId(
	stationId: string,
	options?: Options
): Promise<Api> {
	const [provider, station] = stationId.split('|');
	assertKnownProvider(provider, stationId);

	// Find the cigarettes at the user's last known station (stationId)
	// If anything throws, we retry, up to 5 times.
	return retry(async () => providerFetch(provider, station), options);
}
