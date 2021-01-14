import { NowRequest, NowResponse } from '@vercel/node';

import { User } from '../../backend/models';
import { connectToDatabase, logger, sentrySetup } from '../../backend/util';

sentrySetup();

async function users(req: NowRequest, res: NowResponse): Promise<void> {
	try {
		await connectToDatabase();

		switch (req.method) {
			case 'POST': {
				const user = new User(req.body);
				try {
					await user.save();
				} catch (err) {
					res.status(400).json({ error: (err as Error).message });

					break;
				}

				res.status(201).json(user);

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

export default users;
