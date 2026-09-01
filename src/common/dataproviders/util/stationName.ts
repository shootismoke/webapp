import { OpenAQResult } from './openaq';

/**
 * Get the name of where the measurement has been done, usually the name of the
 * air quality station
 *
 * @param openaq - The OpenAQ format normalized data
 */
export function stationName(data: OpenAQResult): string {
	if (data.attribution && data.attribution.length) {
		return data.attribution[0].name;
	}

	return `Station ${data.location}`;
}
