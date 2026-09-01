import { Pollutant } from '@common/convert';

import { OpenAQResults } from '../types';

/**
 * From some normalized data, calculate the dominant pollutant, i.e. the
 * pollutant that has the highest AQI
 *
 * @param results - The results data in OpenAQResult format.
 */
export function getDominantPol(results: OpenAQResults): Pollutant {
	return results.slice(-1).sort((a, b) => a.value - b.value)[0].parameter;
}
