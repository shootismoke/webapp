import { convert, isPollutant, ugm3 } from '@common/convert';

import { OpenAQResults } from '../../types';
import { getCountryCode, providerError } from '../../util';
import { sanitizeCountry } from '../aqicn/normalize';
import { WaqiResponse } from './types';

/**
 * Normalize aqicn byGps data. Throws an error if the data is invalid.
 *
 * @param data - The data to normalize
 */
export function normalize({ d: [data] }: WaqiResponse): OpenAQResults {
	const stationId = `waqi|${data.x}`;

	if (!isPollutant(data.pol)) {
		throw providerError(
			'waqi',
			`Cannot normalize station ${stationId}, unrecognized pollutant ${
				data.pol
			}: ${JSON.stringify(data)}`
		);
	}

	const aqiUS = +data.v;
	// Calculate pm25 ugm3 value to get cigarettes value
	const ugm3Value = convert('pm25', 'usaEpa', ugm3, aqiUS);

	if (!data.u.includes('/')) {
		throw providerError(
			'waqi',
			`Got invalid country/city info: ${JSON.stringify(data.u)}`
		);
	}
	const [country, city] = data.u.split('/');
	const countryRaw = sanitizeCountry(country);

	// Get UTC time
	const utc = new Date(+data.t * 1000).toISOString();

	const countryCode = getCountryCode(countryRaw);
	if (!countryCode) {
		throw providerError('waqi', `Cannot get code from country ${country}`);
	}

	return [
		{
			attribution: [{ name: data.nlo }],
			averagingPeriod: {
				unit: 'day',
				value: 1,
			},
			coordinates: {
				latitude: data.geo[0],
				longitude: data.geo[1],
			},
			country,
			city,
			date: {
				local: utc, // FIXME How should we get local time from UTC time?
				utc,
			},
			entity: 'other',
			location: `waqi|${data.x}`,
			isMobile: false,
			parameter: data.pol,
			sourceName: 'waqi',
			unit: ugm3, // FIXME Once convert() supports ppm, we should use `getPollutantMeta(data.pol as Pollutant).preferredUnit` here
			value: ugm3Value,
		},
	];
}
