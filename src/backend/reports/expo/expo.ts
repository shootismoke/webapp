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

import { round } from '@shootismoke/ui/lib/util/api';
import { frequencyToPeriod } from '@shootismoke/ui/lib/util/frequency';
import type {
	Frequency,
	IExpoReport,
	MongoUser,
} from '@shootismoke/ui/lib/util/types';
import {
	Expo,
	ExpoPushMessage,
	ExpoPushReceipt,
	ExpoPushReceiptId,
	ExpoPushTicket,
} from 'expo-server-sdk';

import { logger } from '../../util/logger';

/**
 * Generate the body of the push notification message.
 */
export function getMessageBody(
	dailyCigarettes: number,
	frequency: Frequency
): string {
	if (frequency === 'daily') {
		return `Shoot! You'll smoke ${round(dailyCigarettes)} cigarettes today`;
	}

	return `Shoot! You smoked ${round(
		frequency === 'monthly' ? dailyCigarettes * 30 : dailyCigarettes * 7
	)} cigarettes in the past ${frequencyToPeriod(frequency)}.`;
}

/**
 * A user that has notifications.
 */
interface MongoUserWithExpoReport extends MongoUser {
	expoReport: IExpoReport;
}

/**
 * Asserts user has notifications.
 *
 * @param user - User to test if she/he has notifications.
 */
function assertUserWithExpoReport(
	user: MongoUser
): asserts user is MongoUserWithExpoReport {
	if (!user.expoReport) {
		throw new Error(
			`User ${user._id} has notifications, as per our db query. qed.`
		);
	}
}

/**
 * For a user, construct a personalized ExpoPushMessage.
 *
 * @param user - The user to construct the message for
 */
export function constructExpoPushMessage(
	user: MongoUser,
	dailyCigarettes: number
): ExpoPushMessage {
	assertUserWithExpoReport(user);

	const { frequency, expoPushToken } = user.expoReport;

	if (!Expo.isExpoPushToken(expoPushToken)) {
		throw new Error(`Invalid ExpoPushToken: ${expoPushToken}`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
	}

	return {
		body: getMessageBody(dailyCigarettes, frequency),
		title:
			frequency === 'daily'
				? 'Daily forecast'
				: frequency === 'weekly'
				? 'Weekly report'
				: 'Monthly report',
		to: expoPushToken,
		sound: 'default',
	};
}

/**
 * Send a batch of messages (push notifications) to Expo's servers.
 *
 * @see https://github.com/expo/expo-server-sdk-node
 * @param expo - An instance of the Expo class.
 * @param messages - The messages to send.
 */
export async function sendBatchToExpo(
	expo: Expo,
	messages: ExpoPushMessage[]
): Promise<ExpoPushTicket[]> {
	const chunks = expo.chunkPushNotifications(messages);
	const tickets: ExpoPushTicket[] = [];
	// Send the chunks to the Expo push notification service. There are
	// different strategies you could use. A simple one is to send one chunk at a
	// time, which nicely spreads the load out over time:
	for (const chunk of chunks) {
		try {
			const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
			tickets.push(...ticketChunk);
			// NOTE: If a ticket contains an error code in ticket.details.error, you
			// must handle it appropriately. The error codes are listed in the Expo
			// documentation:
			// https://docs.expo.io/versions/latest/guides/push-notifications#response-format
		} catch (error) {
			// On error when sending push notifications, we log the error, but move
			// on with the loop.
			logger.error(error);
		}
	}

	return tickets;
}

/**
 * Handle Expo push receipts.
 *
 * @param expo - Expo class instance.
 * @param receiptIds - The receipt IDs to handle.
 * @param onOk - Handler on successful receipt.
 * @param onError - Handler on error receipt.
 */
export async function handleReceipts(
	expo: Expo,
	receiptIds: string[],
	onOk: (_receiptId: ExpoPushReceiptId, _receipt: ExpoPushReceipt) => void,
	onError: (_receiptId: ExpoPushReceiptId, _receipt: ExpoPushReceipt) => void
): Promise<void> {
	const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
	for (const chunk of receiptIdChunks) {
		try {
			const receipts = await expo.getPushNotificationReceiptsAsync(chunk);

			// The receipts specify whether Apple or Google successfully received the
			// notification and information about an error, if one occurred.
			for (const [receiptId, receipt] of Object.entries(receipts)) {
				if (receipt.status === 'ok') {
					onOk(receiptId, receipt);
				} else if (receipt.status === 'error') {
					onError(receiptId, receipt);
				}
			}
		} catch (error) {
			// On error when sending push notifications, we log the error, but move
			// on with the loop.
			logger.error(error);
		}
	}
}
