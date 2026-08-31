import {
	convert,
	getPollutantMeta,
	Pollutant,
	ugm3,
	usaEpa,
} from '@common/convert';
import { format, utcToZonedTime } from 'date-fns-tz';

import { OpenAQResults } from '../../types';
import { getCountryCode, providerError } from '../../util';
import sanitized from './sanitized.json';
import type { AqicnData } from './validation';

/**
 * Sanitize the country we get here from aqicn. For example, for China, the
 * string after 'https://aqicn.org/city/' is not 'china', but directly the
 * Chinese privince, e.g. 'jiangsu'. In this case, we map directly to China.
 * See sanitized.json for some other sanitazations, these are empirical, so
 * we add them as we discover them.
 *
 * FIXME This is hacky.
 */
export function sanitizeCountry(input: string): string {
	if (sanitized[input.toLowerCase() as keyof typeof sanitized]) {
		return sanitized[input.toLowerCase() as keyof typeof sanitized];
	}

	return input;
}

/**
 * Normalize aqicn byGps data. Throws an error if the data cannot be normalized.
 *
 * @param data - The data to normalize
 */
export function normalize(data: AqicnData): OpenAQResults {
	const stationId = `aqicn|${data.idx}`;

	// Sometimes we don't get geo
	if (!data.city.geo) {
		throw providerError(
			'aqicn',
			`Cannot normalize station ${stationId}, no city: ${JSON.stringify(
				data
			)}`
		);
	}

	// Since AqiCN uses useEpa as AQI for the pollutants, we can only
	// normalize data for those pollutants
	const pollutants = Object.entries(data.iaqi || {}).filter(([pol]) =>
		usaEpa.pollutants.includes(pol as Pollutant)
	);
	if (!pollutants.length) {
		throw providerError(
			'aqicn',
			`Cannot normalize station ${stationId}, no pollutants currently tracked: ${JSON.stringify(
				data
			)}`
		);
	}
	// We now need to get the country from AQICN response. The only place I found
	// is city.url...
	// Example: https://aqicn.org/city/france/lorraine/thionville-nord/garche/
	const AQICN_DOMAIN = 'aqicn.org/city/';
	if (!data.city.url || !data.city.url.includes(AQICN_DOMAIN)) {
		throw providerError(
			'aqicn',
			`Cannot extract country, got city.url: ${data.city.url as string}`
		);
	}
	const countryRaw = sanitizeCountry(
		data.city.url.split(AQICN_DOMAIN)[1].split('/')[0]
	);

	// Get the timezoned date
	const utc = data.time.iso
		? new Date(data.time.iso).toISOString()
		: new Date(+data.time.v * 1000).toISOString(); // FIXME Not sure this works, but iso field being empty is quite rare.
	const local = format(
		utcToZonedTime(utc, data.time.tz || 'Z'),
		"yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
	);

	const countryCode = getCountryCode(countryRaw);
	if (!countryCode) {
		throw providerError(
			'aqicn',
			`Cannot get code from country ${countryRaw}`
		);
	}

	return pollutants.map(([pol, { v }]) => {
		const pollutant = pol as Pollutant;

		if (!data.city.geo) {
			throw new Error(
				'We returned TE.left if data.city.geo was not defined. qed.'
			);
		}

		return {
			attribution: data.attributions,
			averagingPeriod: {
				unit: 'day',
				value: 1,
			},
			city: data.city.name,
			coordinates: {
				latitude: +data.city.geo[0],
				longitude: +data.city.geo[1],
			},
			country: countryCode,
			date: { local, utc },
			location: stationId,
			isMobile: false,
			parameter: pollutant,
			sourceName: 'aqicn',
			entity: 'other',
			value: convert(pollutant, 'usaEpa', ugm3, v),
			unit: getPollutantMeta(pollutant).preferredUnit,
		};
	}) as OpenAQResults;
}
