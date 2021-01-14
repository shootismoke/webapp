import { NowRequest, NowResponse } from '@vercel/node';
import assignDeep from 'assign-deep';

import { PushTicket, User } from '../../../backend/models';
import {
	assertUser,
	connectToDatabase,
	logger,
	sentrySetup,
} from '../../../backend/util';

sentrySetup();

export default async function usersUserId(
	req: NowRequest,
	res: NowResponse
): Promise<void> {
	try {
		await connectToDatabase();

		switch (req.method) {
			case 'GET': {
				const user = await User.findById(req.query.userId).exec();
				assertUser(user, req.query.userId as string);

				res.status(200).json(user);

				break;
			}

			case 'PATCH': {
				const user = await User.findById(req.query.userId).exec();
				assertUser(user, req.query.userId as string);

				// eslint-disable-next-line @typescript-eslint/no-unsafe-call
				assignDeep(user, req.body);

				const newUser = await user.save();

				// Everytime we update user, we also delete all the pushTickets he/she
				// might have.
				await PushTicket.deleteMany({ userId: user._id }).exec();

				res.status(200).json(newUser);

				break;
			}

			default:
				res.status(405).json({
					error: `Unknown request method: ${
						req.method || 'undefined'
					}`,
				});
		}
	} catch (err) {
		logger.error(err);
		res.status(500).json({ error: (err as Error).message });
	}
}
