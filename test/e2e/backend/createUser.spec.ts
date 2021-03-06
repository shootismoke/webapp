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

function testBadInput<T>(name: string, input: T, expErr: string) {
	it(`should require correct input: ${name}`, async (done) => {
		try {
			await axios.post(`${BACKEND_URL}/api/users`, input, axiosConfig);
			done.fail();
		} catch (err) {
			const e = err as AxiosError<BackendError>;
			expect(e.response?.status).toBe(400);
			expect(e.response?.data.error).toContain(expErr);
			done();
		}
	});
}

describe('users::createUser', () => {
	beforeAll(async (done) => {
		jest.setTimeout(30000);

		await connectToDatabase();
		await User.deleteMany();

		done();
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
		'lastStationId: foo is not a valid stationId'
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
			...bob,
			expoReport: { ...bob.expoReport, expoPushToken: undefined },
		},
		'expoReport.expoPushToken: Path `expoPushToken` is required'
	);
	testBadInput(
		'wrong expo frequency',
		{ ...bob, expoReport: { ...bob.expoReport, frequency: 'foo' } },
		'expoReport.frequency: `foo` is not a valid enum value for path `frequency`'
	);

	testBadInput(
		'must set either email and expo notifications',
		{ ...alice, emailReport: undefined },
		'emailReport: Path `emailReport` is required., expoReport: Path `expoReport` is required.'
	);

	testBadInput(
		'cannot set both email and expo notifications',
		{ ...alice, expoReport: { expoPushToken: 'foo', frequency: 'daily' } },
		'either email or expo report must be set, but not both'
	);

	it('should successfully create two users', async () => {
		const aliceData = (
			await axios.post<MongoUser>(
				`${BACKEND_URL}/api/users`,
				alice,
				axiosConfig
			)
		).data;
		expect(aliceData._id).toBeTruthy();
		expect(aliceData).toMatchObject(alice);

		const bobData = (
			await axios.post<MongoUser>(
				`${BACKEND_URL}/api/users`,
				bob,
				axiosConfig
			)
		).data;
		expect(bobData._id).toBeTruthy();
		expect(bobData).toMatchObject(bob);
	});

	testBadInput(
		'duplicate expoPushToken',
		bob,
		'E11000 duplicate key error collection: shootismoke.users index: expoReport.expoPushToken_1 dup key'
	);

	testBadInput(
		'duplicate email',
		alice,
		'E11000 duplicate key error collection: shootismoke.users index: emailReport.email_1 dup key'
	);

	afterAll(() => connection.close());
	afterAll(() => jest.setTimeout(5000));
});
