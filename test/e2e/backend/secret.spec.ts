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
