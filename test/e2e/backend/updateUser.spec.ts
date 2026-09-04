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
import { alice, axiosConfig, BACKEND_URL, bob } from './util/testdata';

let dbAlice: DbUser;

function testBadInput<T>(name: string, input: T, expErr: string) {
	it(`should require correct input: ${name}`, async () => {
		try {
			await axios.patch(
				`${BACKEND_URL}/api/users/${dbAlice._id}`,
				input,
				axiosConfig
			);
			expect(true).toBe(false);
		} catch (err) {
			const e = err as AxiosError<BackendError>;
			expect(e.response?.status).toBe(400);
			expect(e.response?.data.error).toContain(expErr);
		}
	});
}

// eslint-disable-next-line @typescript-eslint/ban-types
function testGoodInput<T extends {}>(name: string, input: T) {
	it(`should be successful: ${name}`, async () => {
		const { data } = await axios.patch<DbUser>(
			`${BACKEND_URL}/api/users/${dbAlice._id}`,
			input,
			axiosConfig
		);

		expect(data).toMatchObject(input);
	});
}

describe('users::updateUser', () => {
	beforeAll(async () => {
		jest.setTimeout(30000);

		User.deleteAll();

		const { data } = await axios.post<DbUser>(
			`${BACKEND_URL}/api/users`,
			alice,
			axiosConfig
		);
		await axios.post<DbUser>(`${BACKEND_URL}/api/users`, bob, axiosConfig);

		dbAlice = data;
	});

	testGoodInput('empty input', {});
	testBadInput(
		'no lastStationId',
		{ lastStationId: null },
		'Path `lastStationId` is required'
	);
	testBadInput(
		'invalid lastStationId',
		{ lastStationId: 'foo' },
		'lastStationId: foo is not a valid universalId'
	);
	testBadInput(
		'no timezone',
		{ ...alice, timezone: null },
		'Path `timezone` is required'
	);
	testBadInput(
		'invalid timezone',
		{ timezone: 'foo' },
		'timezone: `foo` is not a valid enum value for path `timezone`'
	);
	testBadInput(
		'no email',
		{ emailReport: { email: null } },
		'emailReport.email: Path `email` is required'
	);
	testBadInput(
		'bad email',
		{ emailReport: { email: 'foo' } },
		'emailReport.email: Please enter a valid email'
	);
	testBadInput(
		'wrong email frequency',
		{ emailReport: { frequency: 'foo' } },
		'emailReport.frequency: `foo` is not a valid enum value for path `frequency`'
	);
	testGoodInput('change emailReport frequency', {
		emailReport: { frequency: 'monthly' },
	});
	testBadInput(
		'no emailReport',
		{
			emailReport: { email: null },
		},
		'Path `email` is required'
	);
	testBadInput(
		'no expoPushToken',
		{
			expoReport: { expoPushToken: null },
		},
		'expoReport.expoPushToken: Path `expoPushToken` is required'
	);
	testBadInput(
		'wrong expo frequency',
		{ expoReport: { frequency: 'foo' } },
		'expoReport.frequency: `foo` is not a valid enum value for path `frequency`'
	);
	testGoodInput('change expoReport frequency', {
		expoReport: { frequency: 'monthly' },
	});
	testGoodInput('no expoReport', {
		expoReport: null,
	});

	testBadInput(
		'duplicate expoPushToken',
		{
			expoReport: { expoPushToken: bob.expoReport.expoPushToken },
		},
		`duplicate key error: a user with expoPushToken "${bob.expoReport.expoPushToken}" already exists`
	);

	testBadInput(
		'duplicate email',
		{
			emailReport: { email: bob.emailReport.email },
		},
		`duplicate key error: a user with email "${bob.emailReport.email}" already exists`
	);

	afterAll(() => closeDb());
	afterAll(() => {
		jest.setTimeout(5000);
	});
});
