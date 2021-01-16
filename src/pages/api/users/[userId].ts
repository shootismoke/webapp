import assignDeep from 'assign-deep';
import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';

import { PushTicket, User } from '../../../backend/models';
import {
	allowedOrigins,
	assertUser,
	connectToDatabase,
	logger,
	runMiddleware,
	secretHeader,
} from '../../../backend/util';

export default async function usersUserId(
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> {
	await runMiddleware(
		req,
		res,
		Cors({
			origin: allowedOrigins,
			methods: ['GET', 'HEAD', 'PATCH'],
		})
	);

	if (req.headers[secretHeader] !== process.env.BACKEND_SECRET) {
		res.status(400).json({
			error: `incorrect ${secretHeader} header`,
		});
		return;
	}

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
