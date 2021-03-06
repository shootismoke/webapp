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
import { axiosConfig, BACKEND_URL, bob } from './util/testdata';

let dbBob: MongoUser;

describe('users::getUserByExpoPushToken', () => {
	beforeAll(async (done) => {
		jest.setTimeout(30000);

		await connectToDatabase();
		await User.deleteMany();

		const { data } = await axios.post<MongoUser>(
			`${BACKEND_URL}/api/users`,
			bob,
			axiosConfig
		);

		dbBob = data;

		done();
	});

	it('should always require userId', async (done) => {
		try {
			await axios.get<MongoUser>(
				`${BACKEND_URL}/api/users/expoPushToken`,
				axiosConfig
			);
		} catch (err) {
			const e = err as AxiosError<BackendError>;
			expect(e.response?.status).toBe(404);
			expect(e.response?.data.error).toBe(
				'No user with "expoPushToken" found'
			);
			done();
		}
	});

	it('should always fail if userId not found', async (done) => {
		try {
			await axios.get<MongoUser>(
				`${BACKEND_URL}/api/users/expoPushToken/foo`,
				axiosConfig
			);
		} catch (err) {
			const e = err as AxiosError<BackendError>;
			expect(e.response?.status).toBe(404);
			expect(e.response?.data.error).toContain(
				'No user with "foo" found'
			);
			done();
		}
	});

	it('should fetch correct user', async (done) => {
		const { data } = await axios.get<MongoUser>(
			`${BACKEND_URL}/api/users/expoPushToken/${bob.expoReport.expoPushToken}`,
			axiosConfig
		);

		expect(data._id).toBe(dbBob._id);
		expect(data).toMatchObject(dbBob);

		done();
	});

	afterAll(() => connection.close());
	afterAll(() => jest.setTimeout(5000));
});
