import { NowRequest, NowResponse } from '@vercel/node';

import { User } from '../../backend/models';
import {
	assertUser,
	connectToDatabase,
	isWhitelisted,
	logger,
	sentrySetup,
} from '../../backend/util';

sentrySetup();

export default async function emailReport(
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
			 * Send email report to one user.
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
