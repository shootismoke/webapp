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
