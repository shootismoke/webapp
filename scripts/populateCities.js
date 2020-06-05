// Sh**t! I Smoke
// Copyright (C) 2018-2020  Marcelo S. Coelho, Amaury Martiny

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

/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires */

const { raceApiPromise } = require('@shootismoke/ui/lib/util/race');
const pRetry = require('p-retry');
const pAny = require('p-any');

const cities = require('../src/util/cities.json');

/**
 * Populate one city.
 */
function populateCity(city) {
	return pAny([
		pRetry(
			() =>
				raceApiPromise(city.gps, {}).then((api) => ({
					api,
					city,
				})),
			{ retries: 5 }
		).catch(() => ({
			// If it fails after retrying, then we don't return `api`.
			city,
		})),
		// We abort after 10s.
		new Promise((resolve) => setTimeout(() => resolve({ city }), 10000)),
	]);
}

/**
 * For each hardcoded city, populate at build time its API value.
 */
exports.populateCities = () => Promise.all(cities.map(populateCity));
