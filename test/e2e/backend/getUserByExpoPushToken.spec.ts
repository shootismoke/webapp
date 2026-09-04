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

let dbAlice: DbUser;

describe('users::getUserByExpoPushToken', () => {
	beforeAll(async () => {
		jest.setTimeout(30000);

		User.deleteAll();

		const { data } = await axios.post<DbUser>(
			`${BACKEND_URL}/api/users`,
			alice,
			axiosConfig
		);

		dbAlice = data;
	});

	it('should always require userId', async () => {
		try {
			await axios.get<DbUser>(
				`${BACKEND_URL}/api/users/expoPushToken`,
				axiosConfig
			);
		} catch (err) {
			const e = err as AxiosError<BackendError>;
			expect(e.response?.status).toBe(404);
			expect(e.response?.data.error).toBe(
				'No user with "expoPushToken" found'
			);
		}
	});

	it('should always fail if userId not found', async () => {
		try {
			await axios.get<DbUser>(
				`${BACKEND_URL}/api/users/expoPushToken/foo`,
				axiosConfig
			);
		} catch (err) {
			const e = err as AxiosError<BackendError>;
			expect(e.response?.status).toBe(404);
			expect(e.response?.data.error).toContain(
				'No user with "foo" found'
			);
		}
	});

	it('should fetch correct user', async () => {
		const { data } = await axios.get<DbUser>(
			`${BACKEND_URL}/api/users/expoPushToken/${
				dbAlice?.expoReport?.expoPushToken as string
			}`,
			axiosConfig
		);

		expect(data._id).toBe(dbAlice._id);
		expect(data).toMatchObject(
			dbAlice as unknown as Record<string, unknown>
		);
	});

	afterAll(() => closeDb());
	afterAll(() => {
		jest.setTimeout(5000);
	});
});
