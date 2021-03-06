/**
 * This file is part of Sh**t! I Smoke.
 *
 * Copyright (C) 2018-2021  Marcelo S. Coelho, Amaury M.
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

import type { BackendError, MongoUser } from '@shootismoke/ui';
import axios, { AxiosError } from 'axios';
import { connection } from 'mongoose';

import { User } from '../../../src/backend/models';
import { connectToDatabase } from '../../../src/backend/util';
import { alice, axiosConfig, BACKEND_URL, bob } from './util/testdata';

let dbAlice: MongoUser;
let dbBob: MongoUser;

function testBadInput<T>(
	name: string,
	user: 'alice' | 'bob',
	input: T,
	expErr: string
) {
	it(`should require correct input: ${name}`, async (done) => {
		const dbUser = user === 'alice' ? dbAlice : dbBob;
		try {
			await axios.patch(
				`${BACKEND_URL}/api/users/${dbUser._id}`,
				input,
				axiosConfig
			);
			done.fail();
		} catch (err) {
			const e = err as AxiosError<BackendError>;
			expect(e.response?.status).toBe(400);
			expect(e.response?.data.error).toContain(expErr);
			done();
		}
	});
}

function testGoodInput<T>(name: string, user: 'alice' | 'bob', input: T) {
	it(`should be successful: ${name}`, async (done) => {
		const dbUser = user === 'alice' ? dbAlice : dbBob;
		const { data } = await axios.patch<MongoUser>(
			`${BACKEND_URL}/api/users/${dbUser._id}`,
			input,
			axiosConfig
		);

		expect(data).toMatchObject(input);

		done();
	});
}

describe('users::updateUser', () => {
	beforeAll(async (done) => {
		jest.setTimeout(30000);

		await connectToDatabase();
		await User.deleteMany();

		dbAlice = (
			await axios.post<MongoUser>(
				`${BACKEND_URL}/api/users`,
				alice,
				axiosConfig
			)
		).data;

		dbBob = (
			await axios.post<MongoUser>(
				`${BACKEND_URL}/api/users`,
				bob,
				axiosConfig
			)
		).data;

		done();
	});

	testGoodInput('empty input', 'alice', {});
	testBadInput(
		'no lastStationId',
		'alice',
		{ lastStationId: null },
		'Path `lastStationId` is required'
	);
	testBadInput(
		'invalid lastStationId',
		'alice',
		{ lastStationId: 'foo' },
		'lastStationId: foo is not a valid stationId'
	);
	testBadInput(
		'no timezone',
		'alice',
		{ ...alice, timezone: null },
		'Path `timezone` is required'
	);
	testBadInput(
		'invalid timezone',
		'alice',
		{ timezone: 'foo' },
		'timezone: `foo` is not a valid enum value for path `timezone`'
	);

	// Email-specific tests.
	testBadInput(
		'no email',
		'alice',
		{ emailReport: { email: null } },
		'emailReport.email: Path `email` is required'
	);
	testBadInput(
		'bad email',
		'alice',
		{ emailReport: { email: 'foo' } },
		'emailReport.email: Please enter a valid email'
	);
	testBadInput(
		'wrong email frequency',
		'alice',
		{ emailReport: { frequency: 'foo' } },
		'emailReport.frequency: `foo` is not a valid enum value for path `frequency`'
	);
	testGoodInput('change emailReport frequency', 'alice', {
		emailReport: { frequency: 'monthly' },
	});
	testBadInput(
		'no emailReport nor expoReport',
		'bob',
		{
			emailReport: null,
		},
		'emailReport: either email or expo report must be set, but not both'
	);

	// Expo-specific tests.
	testBadInput(
		'no expoPushToken',
		'bob',
		{
			expoReport: { expoPushToken: null },
		},
		'expoReport.expoPushToken: Path `expoPushToken` is required'
	);
	testBadInput(
		'wrong expo frequency',
		'bob',
		{ expoReport: { frequency: 'foo' } },
		'expoReport.frequency: `foo` is not a valid enum value for path `frequency`'
	);
	testGoodInput('change expoReport frequency', 'bob', {
		expoReport: { frequency: 'monthly' },
	});
	testBadInput(
		'no expoReport nor emailReport',
		'bob',
		{
			expoReport: null,
		},
		'emailReport: Path `emailReport` is required., expoReport: Path `expoReport` is required.'
	);

	// Cannot change from email to expo, or vice versa.
	testBadInput(
		'duplicate expoPushToken',
		'alice',
		{
			emailReport: null,
			expoReport: { expoPushToken: bob.expoReport.expoPushToken },
		},
		'either email or expo report must be set, but not both'
	);

	testBadInput(
		'duplicate email',
		'bob',
		{
			expoReport: null,
			emailReport: { email: alice.emailReport.email },
		},
		'either email or expo report must be set, but not both'
	);

	afterAll(() => connection.close());
	afterAll(() => jest.setTimeout(5000));
});
