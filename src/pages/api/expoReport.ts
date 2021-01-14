import { NowRequest, NowResponse } from '@vercel/node';
import { Expo, ExpoPushSuccessTicket } from 'expo-server-sdk';

import {
	expoPushMessageForUser,
	sendBatchToExpo,
} from '../../backend/expoReport';
import { PushTicket, User } from '../../backend/models';
import {
	assertUser,
	connectToDatabase,
	isWhitelisted,
	logger,
	sentrySetup,
} from '../../backend/util';

sentrySetup();

export default async function push(
	req: NowRequest,
	res: NowResponse
): Promise<void> {
	try {
		const ip = req.headers['x-forwarded-for'] as string;

		if (!isWhitelisted(ip)) {
			res.status(403);
			res.send({
				error: `IP address not whitelisted: ${ip}`,
			});
			res.end();
		}

		switch (req.method) {
			/**
			 * Send push notifications to one user.
			 */
			case 'POST': {
				await connectToDatabase();

				// TODO We now call this endpoint for each user, at the time specified
				// for said user in the crontab. Should we double check that the
				// current time of execution of this function matches the cron
				// expression in the DB for this user?
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				const user = await User.findById(req.body?.userId).exec();
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				assertUser(user, req.body?.userId as string);

				// Craft a push notification message for each user
				const message = await expoPushMessageForUser(user);

				// We use the sendBatch function, but we actually only send one push
				// notification.
				const [ticket] = await sendBatchToExpo(new Expo(), [message]);
				if (!ticket) {
					throw new Error(
						`User ${user._id}: Error sending push message to Expo servers`
					);
				}

				const pushTicket = new PushTicket({
					...ticket,
					receiptId: (ticket as ExpoPushSuccessTicket).id,
					userId: message,
				});
				await pushTicket.save();

				res.status(200).send(pushTicket);

				break;
			}

			default: {
				res.status(405).json({
					error: `Unknown request method: ${
						req.method || 'undefined'
					}`,
				});
			}
		}
	} catch (error) {
		logger.error(error);
		res.status(500).send({ error: (error as Error).message });
	}
}
