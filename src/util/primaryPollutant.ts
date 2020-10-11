// Shoot! I Smoke
// Copyright (C) 2018-2020  Marcelo S. Coelho, Amaury Martiny

// Shoot! I Smoke is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Shoot! I Smoke is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Shoot! I Smoke.  If not, see <http://www.gnu.org/licenses/>.

import { convert } from '@shootismoke/convert';
import { Normalized, OpenAQFormat } from '@shootismoke/dataproviders';

/**
 * From a set of normalized pollutant data, filter only the ones that can be
 * converted to USA EPA, and sort the set.
 *
 * @param normalized - The normalized data for all pollutants.
 */
function getSortedNormalized(normalized: Normalized): OpenAQFormat[] {
	// We attempt to sort the pollutants by AQI.
	const unsorted = normalized.filter(({ parameter }) =>
		// Only these pollutants can be converted to usaEpa
		['o3', 'pm10', 'pm25', 'co', 'so2', 'no2'].includes(parameter)
	);

	// Sort the array by AQI.
	unsorted.sort(
		(a, b) =>
			convert(b.parameter, 'raw', 'usaEpa', b.value) -
			convert(a.parameter, 'raw', 'usaEpa', a.value)
	);

	return unsorted;
}

/**
 * From a set of normalized pollutant data, get the AQI.
 *
 * @param normalized - The normalized data for all pollutants.
 */
export function getAQI(normalized: Normalized): number {
	const sorted = getSortedNormalized(normalized);

	if (sorted[0]) {
		return convert(sorted[0].parameter, 'raw', 'usaEpa', sorted[0].value);
	} else {
		// If the `unsorted` array doesn't contain any pollutants, then we just
		// fallback to taking the 1st element's value. This is often not even
		// an AQI. FIXME.
		return normalized[0].value;
	}
}

/**
 * From a set of normalized pollutant data, find the primary pollutant.
 *
 * @param normalized - The normalized data for all pollutants.
 */
export function primaryPollutant(normalized: Normalized): OpenAQFormat {
	const sorted = getSortedNormalized(normalized);

	if (sorted[0]) {
		return sorted[0];
	} else {
		// If the `unsorted` array doesn't contain any pollutants, then we just
		// fallback to taking the 1st element. Most of the case, the 1st
		// element is of course not the primary pollutant though. FIXME.
		return normalized[0];
	}
}
