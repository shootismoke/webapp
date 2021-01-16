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

import { BackendError } from '../../../src/backend/types';
import { IUser } from '../../../src/backend/types';
import { secretHeader } from '../../../src/backend/util';
import { axiosConfig, BACKEND_URL } from './util/testdata';

describe('users::getUser', () => {
	beforeAll(() => jest.setTimeout(30000));

	it('should disallow wrong secret header', async (done) => {
		try {
			await axios.get<IUser>(`${BACKEND_URL}/api/users`, {
				headers: {
					[secretHeader]: 'foo',
				},
			});
		} catch (err) {
			const e = err as AxiosError<BackendError>;
			expect(e.response?.status).toBe(400);
			expect(e.response?.data.error).toBe(
				'incorrect x-shootismoke-secret header'
			);
			done();
		}
	});

	it('should disallow GET on /api/users', async (done) => {
		try {
			await axios.get<IUser>(`${BACKEND_URL}/api/users`, axiosConfig);
		} catch (err) {
			const e = err as AxiosError<BackendError>;
			expect(e.response?.status).toBe(405);
			expect(e.response?.data.error).toBe('Unknown request method: GET');
			done();
		}
	});

	afterAll(() => jest.setTimeout(5000));
});
