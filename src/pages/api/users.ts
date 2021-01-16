import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';

import { User } from '../../backend/models';
import {
	allowedOrigins,
	connectToDatabase,
	logger,
	runMiddleware,
} from '../../backend/util';

async function users(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	await runMiddleware(
		req,
		res,
		Cors({
			origin: allowedOrigins,
			methods: ['GET', 'HEAD', 'PATCH'],
		})
	);

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
					error: `UnkNextApin request method: ${
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
