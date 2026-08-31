import { OpenAQResults } from '../../types';
import { providerError } from '../../util';
import { OpenAQMeasurements } from './types';

/**
 * Normalize aqicn byGps data. Throws an error if the data cannot be normalized.
 *
 * @param data - The data to normalize
 */
export function normalize(data: OpenAQMeasurements): OpenAQResults {
	const { results } = data;

	if (!results.length) {
		throw providerError('openaq', 'Cannot normalize, got 0 result');
	}

	return results.map((result) => ({
		...result,
		location: `openaq|${result.location}`,
	})) as OpenAQResults;
}
