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

import { describe, expect, it } from '@jest/globals';
import { config } from 'dotenv';

import { openaq } from './openaq';

config();

/**
 * OpenAQ v3 needs an API key, so the live checks below only run when one is
 * present. Get one at https://explore.openaq.org/register and put it in
 * `.env` as BACKEND_OPENAQ_API_KEY, or pass it inline:
 *
 *     OPENAQ_API_KEY=xxx npx jest openaq
 */
const apiKey = process.env.OPENAQ_API_KEY || process.env.BACKEND_OPENAQ_API_KEY;

const live = apiKey ? it : it.skip;

// Somewhere with dense coverage, so the test is about our code and not about
// whether a given city happens to have a station.
const gps = { latitude: 48.867, longitude: 2.333 };

describe('openaq', () => {
	it('should throw without an apiKey', async () => {
		await expect(
			openaq.fetchByGps(gps, { apiKey: '' })
		).rejects.toThrowError(new Error('OpenAQ requires an apiKey.'));
	});

	it('should report a rejected key legibly', async () => {
		await expect(
			openaq.fetchByGps(gps, { apiKey: 'not-a-real-key' })
		).rejects.toThrowError(new Error('Invalid credentials'));
	});

	live(
		'should fetch and normalize a live pm25 reading',
		async () => {
			const raw = await openaq.fetchByGps(gps, {
				apiKey: apiKey as string,
			});

			console.log(
				`location ${raw.location.id} (${raw.location.name ?? '?'})`,
				`${raw.location.distance ?? '?'}m away,`,
				`sensor ${raw.sensor.id} ${raw.sensor.parameter.name}`,
				`in ${raw.sensor.parameter.units}`
			);

			const [result] = openaq.normalize(raw);
			console.log(
				`normalized -> ${result.location}`,
				`${result.value} ${result.unit}`,
				`at ${result.date.utc}`
			);

			// /latest returns whenever the station last reported, which can be
			// days ago; fetchByGps should be walking past those.
			const ageHours =
				(Date.now() - new Date(result.date.utc).getTime()) / 3.6e6;
			console.log(`reading is ${ageHours.toFixed(1)}h old`);

			expect(result.parameter).toBe('pm25');
			expect(result.unit).toBe('µg/m³');
			expect(result.location).toBe(`openaq|${raw.location.id}`);
			expect(typeof result.value).toBe('number');
		},
		30000
	);

	live(
		'should skip stations whose latest reading is stale',
		async () => {
			// Nothing can satisfy a one-second freshness window.
			await expect(
				openaq.fetchByGps(gps, {
					apiKey: apiKey as string,
					dateFrom: new Date(Date.now() - 1000),
				})
			).rejects.toThrowError(/has a recent pm25 reading/);
		},
		60000
	);

	live(
		'should round-trip through fetchByStation',
		async () => {
			const byGps = await openaq.fetchByGps(gps, {
				apiKey: apiKey as string,
			});
			const byStation = await openaq.fetchByStation(
				`${byGps.location.id}`,
				{ apiKey: apiKey as string }
			);

			expect(byStation.location.id).toBe(byGps.location.id);
			expect(byStation.sensor.parameter.name).toBe('pm25');
		},
		30000
	);
});
