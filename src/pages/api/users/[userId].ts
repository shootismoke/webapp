/**
 * This file is part of Sh**t! I Smoke.
 *
 * Copyright (C) 2018-2021  Marcelo S. Coelho, Amaury Martiny.
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

			case 'DELETE': {
				const user = await User.findOneAndDelete({
					_id: req.query.userId as string,
				}).exec();
				assertUser(user, req.query.userId as string);

				res.status(200).json(user);

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
