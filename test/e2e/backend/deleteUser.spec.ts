/**
 * This file is part of Sh**t! I Smoke.
 *
 * Copyright (C) 2018-2021  Marcelo S. Coelho, Amaury Martiny.
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

import axios, { AxiosError } from 'axios';
import { connection } from 'mongoose';

import { User } from '../../../src/backend/models';
import { BackendError, IUser } from '../../../src/backend/types';
import { connectToDatabase } from '../../../src/backend/util';
import { alice, axiosConfig, BACKEND_URL, bob } from './util/testdata';

let dbAlice: IUser;
let dbBob: IUser;

/**
 * Make sure the user is deleted and does not exist in the DB anymore.
 */
async function userNotExist(userId: string, done: jest.DoneCallback) {
	try {
		await axios.get<IUser>(`${BACKEND_URL}/api/users/${userId}`);
		done.fail();
	} catch (err) {
		const e = err as AxiosError<BackendError>;
		expect(e.response?.status).toBe(500);
		expect(e.response?.data.error).toContain('ABC');
	}
}

describe('users::updateUser', () => {
	beforeAll(async (done) => {
		jest.setTimeout(30000);

		await connectToDatabase();
		await User.deleteMany();

		const { data: dataAlice } = await axios.post<IUser>(
			`${BACKEND_URL}/api/users`,
			alice,
			axiosConfig
		);
		const { data: dataBob } = await axios.post<IUser>(
			`${BACKEND_URL}/api/users`,
			bob,
			axiosConfig
		);

		dbAlice = dataAlice;
		dbBob = dataBob;

		done();
	});

	it('should require userId DELETE /{userId}', async (done) => {
		try {
			await axios.delete<IUser>(
				`${BACKEND_URL}/api/users/foo`,
				axiosConfig
			);
			done.fail();
		} catch (err) {
			const e = err as AxiosError<BackendError>;
			expect(e.response?.status).toBe(500);
			expect(e.response?.data.error).toContain('ABC');
			done();
		}

		done();
	});

	it('should delete user from DELETE /{userId}', async (done) => {
		await axios.delete<IUser>(
			`${BACKEND_URL}/api/users/${dbAlice._id}`,
			axiosConfig
		);

		await userNotExist(dbAlice._id, done);
		done();
	});

	it('should require userId GET /email/unsubscribe/{userId}', async (done) => {
		try {
			await axios.get<IUser>(
				`${BACKEND_URL}/api/users/email/unsubscribe/foo`,
				axiosConfig
			);
			done.fail();
		} catch (err) {
			const e = err as AxiosError<BackendError>;
			expect(e.response?.status).toBe(500);
			expect(e.response?.data.error).toContain('ABC');
			done();
		}

		done();
	});

	it('should delete user from GET /email/unsubscribe/{userId}', async (done) => {
		await axios.get<IUser>(
			`${BACKEND_URL}/api/users/email/unsubscribe/${dbBob._id}`,
			axiosConfig
		);

		await userNotExist(dbBob._id, done);
		done();
	});

	afterAll(() => connection.close());
	afterAll(() => jest.setTimeout(5000));
});
