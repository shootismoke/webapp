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

import axios from 'axios';
import { connection } from 'mongoose';

import { User } from '../../../src/backend/models';
import { findUsersForReport } from '../../../src/backend/reports/cron';
import { connectToDatabase } from '../../../src/backend/util';
import { alice, axiosConfig, BACKEND_URL, bob, charlie } from './util/testdata';

describe('findUsersForReport', () => {
	beforeAll(async (done) => {
		jest.setTimeout(30000);

		await connectToDatabase();
		await User.deleteMany();

		await Promise.all(
			[alice, bob, charlie].map((u) =>
				axios.post(`${BACKEND_URL}/api/users`, u, axiosConfig)
			)
		);

		done();
	});

	it('should work for at UTC 9:00 on a Friday', async () => {
		// UTC time is 08:27
		// Europe/Berlin time is 09:27
		const now = new Date('2021-01-15T08:27:21.771Z');
		const users = await findUsersForReport('email', now);

		expect(users.length).toBe(2);
	});

	it('should work for at UTC 21:00 on a Sunday', async () => {
		// UTC time is 20:27
		// Europe/Berlin time is 21:27
		// Pacific/Apia time is 9:27
		const now = new Date('2021-01-17T20:27:21.771Z');
		const users = await findUsersForReport('expo', now);

		expect(users.length).toBe(2);
	});

	it('should work for at UTC 21:00 on the 1st of the month', async () => {
		// UTC time is 20:27
		// Europe/Berlin time is 21:27
		// Pacific/Apia time is 9:27
		const now = new Date('2021-01-01T20:27:21.771Z');
		const users = await findUsersForReport('expo', now);

		expect(users.length).toBe(2);
	});

	afterAll(() => connection.close());
	afterAll(() => jest.setTimeout(5000));
});
