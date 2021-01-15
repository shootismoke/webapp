import Expo, { ExpoPushMessage } from 'expo-server-sdk';

import { IUser } from '../../types';
import {
	constructExpoPushMessage,
	handleReceipts,
	sendBatchToExpo,
} from './expo';

describe('constructExpoPushMessage', () => {
	const user = {
		_id: 'alice',
		expoReport: {
			expoPushToken: 'ExponentPushToken[0zK3-xM3PgLEfe31-AafjB]', // real one, unused
			frequency: 'daily',
		},
		timezone: 'Europe/Berlin',
		lastStationId: 'openaq|FR04143',
	} as IUser;

	it('should return Error on wrong notifications', () => {
		expect(() =>
			constructExpoPushMessage({ ...user, expoReport: undefined }, 42)
		).toThrowError(
			new Error('User alice has notifications, as per our db query. qed.')
		);
	});

	it('should return Error on wrong notifications', () => {
		expect(() =>
			constructExpoPushMessage(
				{
					...user,
					expoReport: {
						...user.expoReport,
						expoPushToken: 'foo',
					},
				} as IUser,
				42
			)
		).toThrowError(new Error('Invalid ExpoPushToken: foo'));
	});

	it('should work for daily', () => {
		expect(constructExpoPushMessage(user, 42)).toEqual({
			body: "Shoot! You'll smoke 1.9 cigarettes today",
			sound: 'default',
			title: 'Daily forecast',
			to: 'ExponentPushToken[0zK3-xM3PgLEfe31-AafjB]',
		});
	});

	it('should work for weekly', () => {
		expect(
			constructExpoPushMessage(
				{
					...user,
					expoReport: {
						...user.expoReport,
						frequency: 'weekly',
					},
				} as IUser,
				42
			)
		).toEqual({
			body: 'Shoot! You smoked 13.4 cigarettes in the past week.',
			sound: 'default',
			title: 'Weekly report',
			to: 'ExponentPushToken[0zK3-xM3PgLEfe31-AafjB]',
		});
	});

	it('should work for monthly', () => {
		expect(
			constructExpoPushMessage(
				{
					...user,
					expoReport: {
						...user.expoReport,
						frequency: 'monthly',
					},
				} as IUser,
				42
			)
		).toEqual({
			body: 'Shoot! You smoked 57.3 cigarettes in the past month.',
			sound: 'default',
			title: 'Monthly report',
			to: 'ExponentPushToken[0zK3-xM3PgLEfe31-AafjB]',
		});
	});
});

describe('sendBatchToExpo', () => {
	it('should call sendPushNotificationsAsync', async (done) => {
		const expo = ({
			chunkPushNotifications: jest.fn(<T>(a: T[]) =>
				a.map((value) => [value])
			),
			sendPushNotificationsAsync: jest.fn(() => Promise.resolve([])),
		} as unknown) as Expo;

		const messages: ExpoPushMessage[] = [{ to: 'foo' }, { to: 'bar' }];
		await sendBatchToExpo(expo, messages);
		expect(expo.chunkPushNotifications).toBeCalledTimes(1); // eslint-disable-line @typescript-eslint/unbound-method
		expect(expo.sendPushNotificationsAsync).toBeCalledTimes(2); // eslint-disable-line @typescript-eslint/unbound-method

		done();
	});
});

describe('handleReceipts', () => {
	it('should correctly call onOk and onError', async (done) => {
		const receipts = {
			receiptA: { status: 'ok' },
			receiptB: { status: 'error', message: 'foo' },
		};
		const expo = ({
			chunkPushNotificationReceiptIds: jest.fn(() => [
				Object.keys(receipts),
			]),
			getPushNotificationReceiptsAsync: jest.fn(() =>
				Promise.resolve(receipts)
			),
		} as unknown) as Expo;
		const onOk = jest.fn();
		const onError = jest.fn();

		await handleReceipts(expo, Object.keys(receipts), onOk, onError);
		expect(onOk).toHaveBeenCalledTimes(1);
		expect(onError).toHaveBeenCalledTimes(1);

		done();
	});
});
