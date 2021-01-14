import { AllProviders } from '@shootismoke/dataproviders';
import { aqicn, openaq, waqi } from '@shootismoke/dataproviders/lib/promise';
import type { Api } from '@shootismoke/ui/lib/util/api';
import { createApi } from '@shootismoke/ui/lib/util/race';
import retry from 'async-retry';
import { ExpoPushMessage } from 'expo-server-sdk';

import { IUser } from '../types';
import { constructExpoPushMessage } from './expo';

type AllProviders = 'aqicn' | 'openaq' | 'waqi';

/**
 * Given some normalized data points, filter out the first one that contains
 * pm25 data. Returns a TaskEither left is none is found, or format the data
 * into the Api interface
 *
 * @param normalized - The normalized data to process
 */
async function providerFetch(
	provider: AllProviders,
	station: string
): Promise<Api> {
	const normalized =
		provider === 'aqicn'
			? aqicn.normalizeByStation(
					await aqicn.fetchByStation(station, {
						token: process.env.BACKEND_AQICN_TOKEN as string,
					})
			  )
			: provider === 'waqi'
			? waqi.normalizeByStation(await waqi.fetchByStation(station))
			: openaq.normalizeByStation(
					await openaq.fetchByStation(station, {
						limit: 1,
						parameter: ['pm25'],
					})
			  );

	// Gps coordinates are irrelevant for expo report.
	return createApi({ latitude: 0, longitude: 0 }, normalized);
}

function assertKnownProvider(
	provider: string,
	universalId: string
): asserts provider is AllProviders {
	if (!AllProviders.includes(provider)) {
		throw new Error(
			`universalFetch: Unrecognized universalId "${universalId}".`
		);
	}
}

/**
 * Fetch data from correct provider, based on universalId.
 *
 * @param universalId - The universalId of the station
 */
async function universalFetch(universalId: string): Promise<Api> {
	const [provider, station] = universalId.split('|');
	assertKnownProvider(provider, universalId);

	return providerFetch(provider, station);
}

/**
 * Generate the correct expo message for our user.
 *
 * @param user - User in our DB.
 */
export async function expoPushMessageForUser(
	user: IUser
): Promise<ExpoPushMessage> {
	try {
		// Find the PM2.5 value at the user's last known station (universalId)
		// If anything throws, we retry
		const pm25 = await retry(
			async () => {
				const {
					pm25: { value },
				} = await universalFetch(user.lastStationId);

				return value;
			},
			{ retries: 5 }
		);

		return constructExpoPushMessage(user, pm25);
	} catch (error) {
		throw new Error(`User ${user._id}: ${(error as Error).message}`);
	}
}
