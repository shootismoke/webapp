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

import type { MongoUser } from '@shootismoke/ui';
import Expo, { ExpoPushMessage } from 'expo-server-sdk';

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
	} as MongoUser;

	it('should return Error on wrong notifications', () => {
		expect(() =>
			constructExpoPushMessage(
				{ ...user, expoReport: undefined } as MongoUser,
				42
			)
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
				} as MongoUser,
				42
			)
		).toThrowError(new Error('Invalid ExpoPushToken: foo'));
	});

	it('should work for daily', () => {
		expect(constructExpoPushMessage(user, 42)).toEqual({
			body: "Shoot! You'll smoke 42 cigarettes today",
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
				} as MongoUser,
				42
			)
		).toEqual({
			body: 'Shoot! You smoked 294 cigarettes in the past week.',
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
				} as MongoUser,
				42
			)
		).toEqual({
			body: 'Shoot! You smoked 1260 cigarettes in the past month.',
			sound: 'default',
			title: 'Monthly report',
			to: 'ExponentPushToken[0zK3-xM3PgLEfe31-AafjB]',
		});
	});
});

describe('sendBatchToExpo', () => {
	it('should call sendPushNotificationsAsync', async () => {
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
	});
});

describe('handleReceipts', () => {
	it('should correctly call onOk and onError', async () => {
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
	});
});
