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

/**
 * Make sure the user is deleted and does not exist in the DB anymore.
 */
async function userNotExist(userId: string, done: jest.DoneCallback) {
	try {
		await axios.get<MongoUser>(
			`${BACKEND_URL}/api/users/${userId}`,
			axiosConfig
		);
		done.fail();
	} catch (err) {
		const e = err as AxiosError<BackendError>;
		expect(e.response?.status).toBe(404);
		expect(e.response?.data.error).toContain('No user with');
	}
}

describe('users::updateUser', () => {
	beforeAll(async (done) => {
		jest.setTimeout(30000);

		await connectToDatabase();
		await User.deleteMany();

		const { data: dataAlice } = await axios.post<MongoUser>(
			`${BACKEND_URL}/api/users`,
			alice,
			axiosConfig
		);
		const { data: dataBob } = await axios.post<MongoUser>(
			`${BACKEND_URL}/api/users`,
			bob,
			axiosConfig
		);

		dbAlice = dataAlice;
		dbBob = dataBob;

		done();
	});

	it('should require userId in DELETE /{userId}', async (done) => {
		try {
			await axios.delete<MongoUser>(
				`${BACKEND_URL}/api/users/foo`,
				axiosConfig
			);
			done.fail();
		} catch (err) {
			const e = err as AxiosError<BackendError>;
			expect(e.response?.status).toBe(404);
			expect(e.response?.data.error).toBe('No user with "foo" found');
			done();
		}

		done();
	});

	it('should delete user from DELETE /{userId}', async (done) => {
		await axios.delete<MongoUser>(
			`${BACKEND_URL}/api/users/${dbAlice._id}`,
			axiosConfig
		);

		await userNotExist(dbAlice._id, done);
		done();
	});

	it('should require userId GET /email/unsubscribe/{userId}', async (done) => {
		try {
			await axios.get<MongoUser>(
				`${BACKEND_URL}/api/users/email/unsubscribe/foo`
			);
			done.fail();
		} catch (err) {
			const e = err as AxiosError<BackendError>;
			expect(e.response?.status).toBe(404);
			expect(e.response?.data.error).toBe('No user with "foo" found');
			done();
		}

		done();
	});

	it('should delete user from GET /email/unsubscribe/{userId}', async (done) => {
		// Note: no axiosConfig here.
		await axios.get<MongoUser>(
			`${BACKEND_URL}/api/users/email/unsubscribe/${dbBob._id}`
		);

		await userNotExist(dbBob._id, done);
		done();
	});

	afterAll(() => connection.close());
	afterAll(() => jest.setTimeout(5000));
});
