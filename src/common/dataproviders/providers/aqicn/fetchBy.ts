import { LatLng } from '../../types';
import { fetchAndDecode } from '../../util/fetch';
import { AqicnData, AqicnResponse } from './validation';

/**
 * Check if the response we get from aqicn is `{"status": "error", "msg": "..."}`,
 * if yes, return an error.
 */
function checkError({ status, data, msg }: AqicnResponse): AqicnData {
	if (status === 'ok' && typeof data === 'object') {
		return data;
	} else {
		throw new Error(msg || (data as string));
	}
}

export interface AqicnOptions {
	/**
	 * Aqicn token
	 * @see https://aqicn.org/data-platform/token/#/
	 */
	token: string;
}

/**
 * Fetch the closest station to the user's current position
 *
 * @param gps - Latitude and longitude of the user's current position
 */
export function fetchByGps(
	gps: LatLng,
	options: AqicnOptions
): Promise<AqicnData> {
	if (!options || !options.token) {
		throw new Error('AqiCN requires a token');
	}

	const { latitude, longitude } = gps;

	return fetchAndDecode<AqicnResponse>(
		`https://api.waqi.info/feed/geo:${latitude};${longitude}/?token=${options.token}`
	).then(checkError);
}

/**
 * Fetch data by station
 *
 * @param stationId - The station ID to search
 */
export async function fetchByStation(
	stationId: string,
	options: AqicnOptions
): Promise<AqicnData> {
	if (!options || !options.token) {
		throw new Error('AqiCN requires a token');
	}

	return fetchAndDecode<AqicnResponse>(
		`https://api.waqi.info/feed/@${stationId}/?token=${options.token}`
	).then(checkError);
}
