import axios from 'axios';
import { connection } from 'mongoose';

import { User } from '../../../src/backend/models';
import { findUsersForReport } from '../../../src/backend/reports/cron';
import { connectToDatabase } from '../../../src/backend/util';
import { alice, BACKEND_URL, bob, charlie } from './util/testdata';

describe('findUsersForReport', () => {
	beforeAll(async (done) => {
		jest.setTimeout(30000);

		await connectToDatabase();
		await User.deleteMany();

		await Promise.all(
			[alice, bob, charlie].map((u) =>
				axios.post(`${BACKEND_URL}/api/users`, u)
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
