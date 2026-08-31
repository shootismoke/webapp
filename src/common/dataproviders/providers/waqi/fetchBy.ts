import { LatLng } from '../../types';
import { fetchAndDecode } from '../../util/fetch';
import { WaqiResponse } from './types';

/**
 * Fetch the closest station to the user's current position.
 *
 * @param gps - Latitude and longitude of the user's current position
 */
export function fetchByGps(gps: LatLng): Promise<WaqiResponse> {
	const { latitude, longitude } = gps;

	return fetchAndDecode(
		`https://wind.waqi.info/mapq/nearest?geo=1/${latitude}/${longitude}`
	);
}
