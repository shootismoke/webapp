import axios, { AxiosError } from 'axios';
import { connection } from 'mongoose';

import { User } from '../../../src/backend/models';
import { IUser } from '../../../src/backend/types';
import { BackendError } from '../../../src/backend/types';
import { connectToDatabase } from '../../../src/backend/util';
import { alice, axiosConfig, BACKEND_URL } from './util/testdata';

function testBadInput<T>(name: string, input: T, expErr: string) {
	it(`should require correct input: ${name}`, async (done) => {
		try {
			await axios.post(`${BACKEND_URL}/api/users`, input, axiosConfig);
			done.fail();
		} catch (err) {
			const e = err as AxiosError<BackendError>;
			expect(e.response?.status).toBe(400);
			expect(e.response?.data.error).toContain(expErr);
			done();
		}
	});
}

describe('users::createUser', () => {
	beforeAll(async (done) => {
		jest.setTimeout(30000);

		await connectToDatabase();
		await User.deleteMany();

		done();
	});

	testBadInput('empty input', {}, 'User validation failed');
	testBadInput(
		'no lastStationId',
		{ ...alice, lastStationId: undefined },
		'Path `lastStationId` is required'
	);
	testBadInput(
		'invalid lastStationId',
		{ ...alice, lastStationId: 'foo' },
		'lastStationId: foo is not a valid universalId'
	);
	testBadInput(
		'no timezone',
		{ ...alice, timezone: undefined },
		'Path `timezone` is required'
	);
	testBadInput(
		'invalid timezone',
		{ ...alice, timezone: 'foo' },
		'timezone: `foo` is not a valid enum value for path `timezone`'
	);
	testBadInput(
		'no email',
		{ ...alice, emailReport: { ...alice.emailReport, email: undefined } },
		'emailReport.email: Path `email` is required'
	);
	testBadInput(
		'bad email',
		{ ...alice, emailReport: { ...alice.emailReport, email: 'foo' } },
		'emailReport.email: Please enter a valid email'
	);
	testBadInput(
		'wrong email frequency',
		{ ...alice, emailReport: { ...alice.emailReport, frequency: 'foo' } },
		'emailReport.frequency: `foo` is not a valid enum value for path `frequency`'
	);
	testBadInput(
		'no expoPushToken',
		{
			...alice,
			expoReport: { ...alice.expoReport, expoPushToken: undefined },
		},
		'expoReport.expoPushToken: Path `expoPushToken` is required'
	);
	testBadInput(
		'wrong expo frequency',
		{ ...alice, expoReport: { ...alice.expoReport, frequency: 'foo' } },
		'expoReport.frequency: `foo` is not a valid enum value for path `frequency`'
	);

	it('should successfully create a user', async () => {
		const { data } = await axios.post<IUser>(
			`${BACKEND_URL}/api/users`,
			alice,
			axiosConfig
		);
		expect(data._id).toBeTruthy();
		expect(data).toMatchObject(alice);
	});

	testBadInput(
		'duplicate expoPushToken',
		alice,
		'E11000 duplicate key error collection: shootismoke.users index: expoReport.expoPushToken_1 dup key'
	);

	testBadInput(
		'duplicate email',
		{ ...alice, expoReport: undefined },
		'E11000 duplicate key error collection: shootismoke.users index: emailReport.email_1 dup key'
	);

	afterAll(() => connection.close());
	afterAll(() => jest.setTimeout(5000));
});
