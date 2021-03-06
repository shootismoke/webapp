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

import {
	Expo as ExpoBase,
	ExpoPushMessage,
	ExpoPushTicket,
} from 'expo-server-sdk';

export type {
	ExpoClientOptions,
	ExpoPushMessage,
	ExpoPushReceipt,
	ExpoPushReceiptId,
	ExpoPushTicket,
	ExpoPushToken,
} from 'expo-server-sdk';

export class Expo {
	static isExpoPushToken(token: string): boolean {
		return ExpoBase.isExpoPushToken(token);
	}

	chunkPushNotifications(messages: ExpoPushMessage[]): ExpoPushMessage[][] {
		return [messages];
	}

	sendPushNotificationsAsync(): Promise<ExpoPushTicket[]> {
		return Promise.resolve([{ id: 'foo', status: 'ok' }]);
	}
}

export default Expo;
