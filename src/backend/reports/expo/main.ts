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

import debug from 'debug';
import { config } from 'dotenv';
import { Expo, ExpoPushMessage, ExpoPushSuccessTicket } from 'expo-server-sdk';

import { PushTicket } from '../../models';
import type { MongoPushTicket } from '../../types';
import { IUser } from '../../types';
import { connectToDatabase } from '../../util';
import { findUsersForReport } from '../cron';
import { universalFetch } from '../provider';
import { constructExpoPushMessage, sendBatchToExpo } from './expo';

config({ path: '.env.staging' });

const l = debug('shootismoke:expoReport');

/**
 * ExpoPushMessageWithUser is ExpoPushMessage with the associated userId.
 */
interface ExpoPushMessageWithUser {
	pushMessage: ExpoPushMessage;
	userId: string;
}

/**
 * Generate the correct expo push notification message for our user.
 *
 * @param user - User in our DB.
 */
async function expoPushMessageForUser(
	user: IUser
): Promise<ExpoPushMessageWithUser> {
	try {
		const api = await universalFetch(user.lastStationId);

		return {
			userId: user._id,
			pushMessage: constructExpoPushMessage(
				user,
				api.shootismoke.dailyCigarettes
			),
		};
	} catch (error) {
		throw new Error(`User ${user._id}: ${(error as Error).message}`);
	}
}

/**
 * Main entry point of the script to send expo reports to all users.
 */
export async function main(): Promise<void> {
	l('Starting expo report script.');
	await connectToDatabase();

	// Fetch all users to whom we should send an expo report.
	const users = await findUsersForReport('expo');
	l('Found %d users to send expo push notifications to.', users.length);

	// TODO: To not spam OpenAQ, WAQI and Mailgun servers too hard at once,
	// should we spread the requests a little bit (by chunks, or with a simple
	// queue)?
	const expoMessages = await Promise.allSettled(
		users.map(expoPushMessageForUser)
	);

	const rejected = expoMessages.filter(
		(p) => p.status === 'rejected'
	) as PromiseRejectedResult[];
	const successful = expoMessages.filter(
		(p) => p.status === 'fulfilled'
	) as PromiseFulfilledResult<ExpoPushMessageWithUser>[];

	const tickets = await sendBatchToExpo(
		new Expo(),
		successful.map(({ value: { pushMessage } }) => pushMessage)
	);

	await PushTicket.insertMany(
		tickets.map(
			(ticket, index) =>
				({
					...ticket,
					receiptId: (ticket as ExpoPushSuccessTicket).id, // Will be empty if ticket is not successful.
					userId: successful[index].value.userId,
				} as MongoPushTicket)
		)
	);

	l(
		`Sent ${successful.length}/${users.length} successful expo notifications.`
	);
	if (rejected.length) {
		l(`${rejected.length}/${users.length} rejected:`);
		l(rejected);
	}
}
