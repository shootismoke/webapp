// Sh**t! I Smoke
// Copyright (C) 2018-2021  Marcelo S. Coelho, Amaury M.

// Sh**t! I Smoke is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Sh**t! I Smoke is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Sh**t! I Smoke.  If not, see <http://www.gnu.org/licenses/>.

import { isPollutant, ugm3 } from '@common/convert';

import { OpenAQResults } from '../../types';
import { providerError } from '../../util';
import { OpenAQMeasurements } from './types';

export function normalize(data: OpenAQMeasurements): OpenAQResults {
	const { location, sensor, latest } = data;

	const parameter = sensor.parameter.name;
	if (!isPollutant(parameter)) {
		throw providerError(
			'openaq',
			`Cannot normalize, unrecognized pollutant ${parameter}`
		);
	}

	// v3 reports units per sensor. We only understand µg/m³ downstream, and
	// `createApi` filters on it anyway, so reject anything else here where the
	// message is still useful.
	if (sensor.parameter.units !== ugm3) {
		throw providerError(
			'openaq',
			`Cannot normalize, ${parameter} is reported in ${sensor.parameter.units}, not ${ugm3}`
		);
	}

	return [
		{
			attribution: [{ name: location.provider.name }],
			city: location.locality ?? undefined,
			coordinates:
				latest.coordinates.latitude !== null &&
				latest.coordinates.longitude !== null
					? {
							latitude: latest.coordinates.latitude,
							longitude: latest.coordinates.longitude,
					  }
					: undefined,
			country: location.country.code,
			date: {
				local: latest.datetime.local,
				utc: latest.datetime.utc,
			},
			entity: 'other',
			isMobile: location.isMobile,
			location: `openaq|${location.id}`,
			parameter,
			sourceName: 'openaq',
			unit: ugm3,
			value: latest.value,
		},
	] as OpenAQResults;
}
