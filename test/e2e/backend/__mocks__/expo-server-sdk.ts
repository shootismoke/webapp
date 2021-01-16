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
