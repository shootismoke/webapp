// Sh**t! I Smoke
// Copyright (C) 2018-2026  Marcelo S. Coelho, Amaury.

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

import { convert, Pollutant, ugm3 } from '@common/convert';
import { OpenAQResult, OpenAQResults } from '@common/dataproviders';

type PollutantData = { effects: string; name: string };

/**
 * Definitions and effects of various pollutants.
 *
 * @see https://www.sciencedirect.com/topics/chemistry/air-pollutant
 */
const pollutantData: Partial<Record<Pollutant, PollutantData>> = {
	bc: {
		effects:
			'Black carbon is a potent climate-warming component of particulate matter formed by the incomplete combustion of fossil fuels, wood and other fuels.',
		name: 'Black Carbon',
	},
	c6h6: {
		effects:
			'Hydrocarbons are the primary pollutants that produce photochemical smog.',
		name: 'Hydrocarbons',
	},
	ch4: {
		effects: 'Partly responsible for the atmospheric greenhouse effect.',
		name: 'Methane',
	},
	co: {
		effects:
			'Carbon monoxide reduces the oxygen-carrying capacity of the blood by combining with haemoglobin, thus deprives tissues of O2.',
		name: 'Carbon monoxide',
	},
	// FIXME Add co2
	// co2: {
	// 	effects: 'Partly responsible for the atmospheric greenhouse effect',
	// },
	no: {
		effects:
			'Nitrogen oxides cause eye, throat, and lung irritation. Primary pollutants that produce photochemical smog and acid rain, destroy ozone at the stratosphere.',
		name: 'Nitrogen oxides',
	},
	no2: {
		effects:
			'Nitrogen oxides cause eye, throat, and lung irritation. Primary pollutants that produce photochemical smog and acid rain, destroy ozone at the stratosphere.',
		name: 'Nitrogen oxides',
	},
	o3: {
		effects:
			'Ozone causes eye, throat, and lung irritation, impairs lung function.',
		name: 'Ozone',
	},
	pm10: {
		effects:
			'Particulate matters under 10μm (PM10), may cause breathing difficulties.',
		name: 'Particulates',
	},
	pm25: {
		effects:
			'Particulate matters under 2.5μm (PM2.5), may cause breathing difficulties.',
		name: 'Particulates',
	},
	so2: {
		effects:
			'Sulfur dioxide causes eye, throat, and lung irritation. Primary pollutants that produce acid rain.',
		name: 'Sulfur dioxide',
	},
};

/**
 * Get metadata about a pollutant.
 *
 * @param pollutant - The pollutant to get the data.
 */
export function getPollutantData(pollutant: Pollutant): PollutantData {
	const polData = pollutantData[pollutant];

	if (!polData) {
		throw new Error('All pollutants are in pollutantData. qed.');
	}

	return polData;
}

/**
 * From a set of OpenAQResults pollutant data, filter only the ones that can be
 * converted to USA EPA, and sort the set.
 *
 * @param results - The OpenAQResults data for all pollutants.
 */
function getSortedOpenAQResults(results: OpenAQResults): OpenAQResult[] {
	// We attempt to sort the pollutants by AQI.
	const unsorted = results
		// Since we can only convert ugm3, we filter those results.
		.filter(({ unit }) => unit === ugm3)
		// Only these pollutants can be converted to usaEpa
		.filter(({ parameter }) =>
			['o3', 'pm10', 'pm25', 'co', 'so2', 'no2'].includes(parameter)
		);

	// Sort the array by AQI.
	unsorted.sort(
		(a, b) =>
			convert(b.parameter, b.unit, 'usaEpa', b.value) -
			convert(a.parameter, a.unit, 'usaEpa', a.value)
	);

	return unsorted;
}

/**
 * From a set of OpenAQResults pollutant data, get the AQI, that is, the AQI of
 * the primary pollutant.
 *
 * @param OpenAQResults - The OpenAQResults data for all pollutants.
 */
export function getAQI(results: OpenAQResults): number | undefined {
	const sorted = getSortedOpenAQResults(results);

	if (sorted[0]) {
		try {
			return convert(
				sorted[0].parameter,
				sorted[0].unit,
				'usaEpa',
				sorted[0].value
			);
		} catch (err) {
			// convert() throws if the unit is not supported. We just silently
			// return an error.
			return;
		}
	}
}

/**
 * From a set of OpenAQResults pollutant data, find the primary pollutant.
 *
 * @param results - The OpenAQResults data for all pollutants.
 */
export function primaryPollutant(
	results: OpenAQResults
): OpenAQResult | undefined {
	const sorted = getSortedOpenAQResults(results);

	if (sorted[0]) {
		return sorted[0];
	}
}
