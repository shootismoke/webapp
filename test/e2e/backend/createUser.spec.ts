/**
 * This file is part of Sh**t! I Smoke.
 *
 * Copyright (C) 2018-2026  Marcelo S. Coelho, Amaury.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type { BackendError, DbUser } from '@common/ui';
import { afterAll, beforeAll, expect, jest } from '@jest/globals';
import axios, { AxiosError } from 'axios';

import { User } from '../../../src/backend/models';
import { closeDb } from '../../../src/backend/util';
import { alice, axiosConfig, BACKEND_URL } from './util/testdata';

function testBadInput<T>(name: string, input: T, expErr: string) {
	it(`should require correct input: ${name}`, async () => {
		try {
			await axios.post(`${BACKEND_URL}/api/users`, input, axiosConfig);
			expect(true).toBe(false);
		} catch (err) {
			const e = err as AxiosError<BackendError>;
			expect(e.response?.status).toBe(400);
			expect(e.response?.data.error).toContain(expErr);
		}
	});
}

describe('users::createUser', () => {
	beforeAll(() => {
		jest.setTimeout(30000);

		User.deleteAll();
	});

	testBadInput('empty input', {}, 'User validation failed');
	testBadInput(
		'no lastStationId',
		{ ...alice, lastStationId: undefined },
		'Path `lastStationId` is required'
	);
	testBadInput(
		'invalid lastStationId',
		{ ...alice, lastStationId: 'foo' },
		'lastStationId: foo is not a valid universalId'
	);
	testBadInput(
		'no timezone',
		{ ...alice, timezone: undefined },
		'Path `timezone` is required'
	);
	testBadInput(
		'invalid timezone',
		{ ...alice, timezone: 'foo' },
		'timezone: `foo` is not a valid enum value for path `timezone`'
	);
	testBadInput(
		'no email',
		{ ...alice, emailReport: { ...alice.emailReport, email: undefined } },
		'emailReport.email: Path `email` is required'
	);
	testBadInput(
		'bad email',
		{ ...alice, emailReport: { ...alice.emailReport, email: 'foo' } },
		'emailReport.email: Please enter a valid email'
	);
	testBadInput(
		'wrong email frequency',
		{ ...alice, emailReport: { ...alice.emailReport, frequency: 'foo' } },
		'emailReport.frequency: `foo` is not a valid enum value for path `frequency`'
	);
	testBadInput(
		'no expoPushToken',
		{
			...alice,
			expoReport: { ...alice.expoReport, expoPushToken: undefined },
		},
		'expoReport.expoPushToken: Path `expoPushToken` is required'
	);
	testBadInput(
		'wrong expo frequency',
		{ ...alice, expoReport: { ...alice.expoReport, frequency: 'foo' } },
		'expoReport.frequency: `foo` is not a valid enum value for path `frequency`'
	);

	it('should successfully create a user', async () => {
		const { data } = await axios.post<DbUser>(
			`${BACKEND_URL}/api/users`,
			alice,
			axiosConfig
		);
		expect(data._id).toBeTruthy();
		expect(data).toMatchObject(alice);
	});

	// A re-POST of alice collides on both unique indexes at once; SQLite
	// reports the first one it hits, so drop the other field to reach the
	// email index.
	testBadInput(
		'duplicate expoPushToken',
		alice,
		`duplicate key error: a user with expoPushToken "${alice.expoReport.expoPushToken}" already exists`
	);

	testBadInput(
		'duplicate email',
		{ ...alice, expoReport: undefined },
		`duplicate key error: a user with email "${alice.emailReport.email}" already exists`
	);

	afterAll(() => closeDb());
	afterAll(() => {
		jest.setTimeout(5000);
	});
});
