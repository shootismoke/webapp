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

import { secretHeader } from '../../../src/backend/util';
import { axiosConfig, BACKEND_URL } from './util/testdata';

describe('users::getUser', () => {
	beforeAll(() => jest.setTimeout(30000));

	it('should disallow wrong secret header', async () => {
		try {
			await axios.get<MongoUser>(`${BACKEND_URL}/api/users`, {
				headers: {
					[secretHeader]: 'foo',
				},
			});
		} catch (err) {
			const e = err as AxiosError<BackendError>;
			expect(e.response?.status).toBe(401);
			expect(e.response?.data.error).toBe(
				'incorrect x-shootismoke-secret header'
			);
		}
	});

	it('should disallow GET on /api/users', async () => {
		try {
			await axios.get<MongoUser>(`${BACKEND_URL}/api/users`, axiosConfig);
		} catch (err) {
			const e = err as AxiosError<BackendError>;
			expect(e.response?.status).toBe(405);
			expect(e.response?.data.error).toBe(
				'Unknown request method: GET /api/users'
			);
		}
	});

	afterAll(() => jest.setTimeout(5000));
});
