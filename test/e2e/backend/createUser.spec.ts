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
import { alice, axiosConfig, BACKEND_URL } from './util/testdata';

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
		const { data } = await axios.post<MongoUser>(
			`${BACKEND_URL}/api/users`,
			alice,
			axiosConfig
		);
		expect(data._id).toBeTruthy();
		expect(data).toMatchObject(alice);
	});

	testBadInput(
		'duplicate expoPushToken',
		alice,
		'E11000 duplicate key error collection: shootismoke.users index: expoReport.expoPushToken_1 dup key'
	);

	testBadInput(
		'duplicate email',
		{ ...alice, expoReport: undefined },
		'E11000 duplicate key error collection: shootismoke.users index: emailReport.email_1 dup key'
	);

	afterAll(() => connection.close());
	afterAll(() => jest.setTimeout(5000));
});
