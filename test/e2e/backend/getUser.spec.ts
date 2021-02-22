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

import axios, { AxiosError } from 'axios';
import { connection } from 'mongoose';

import { User } from '../../../src/backend/models';
import { BackendError } from '../../../src/backend/types';
import { IUser } from '../../../src/backend/types';
import { connectToDatabase } from '../../../src/backend/util';
import { alice, axiosConfig, BACKEND_URL } from './util/testdata';

let dbAlice: IUser;

describe('users::getUser', () => {
	beforeAll(async (done) => {
		jest.setTimeout(30000);

		await connectToDatabase();
		await User.deleteMany();

		const { data } = await axios.post<IUser>(
			`${BACKEND_URL}/api/users`,
			alice,
			axiosConfig
		);

		dbAlice = data;

		done();
	});

	it('should always require userId', async (done) => {
		try {
			await axios.get<IUser>(`${BACKEND_URL}/api/users`, axiosConfig);
		} catch (err) {
			const e = err as AxiosError<BackendError>;
			expect(e.response?.status).toBe(405);
			expect(e.response?.data.error).toBe('Unknown request method: GET');
			done();
		}
	});

	it('should always fail if userId not found', async (done) => {
		try {
			await axios.get<IUser>(`${BACKEND_URL}/api/users/foo`, axiosConfig);
		} catch (err) {
			const e = err as AxiosError<BackendError>;
			expect(e.response?.status).toBe(500);
			expect(e.response?.data.error).toContain(
				'No user with userId "foo" found'
			);
			done();
		}
	});

	it('should fetch correct user', async (done) => {
		const { data } = await axios.get<IUser>(
			`${BACKEND_URL}/api/users/${dbAlice?._id}`,
			axiosConfig
		);

		expect(data._id).toBe(dbAlice._id);
		expect(data).toMatchObject(dbAlice);

		done();
	});

	afterAll(() => connection.close());
	afterAll(() => jest.setTimeout(5000));
});
