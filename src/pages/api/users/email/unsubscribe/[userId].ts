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

import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';

import { User } from '../../../../../backend/models';
import {
	assertUser,
	connectToDatabase,
	logger,
	runMiddleware,
} from '../../../../../backend/util';

export default async function emailUnsubscribe(
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> {
	await runMiddleware(
		req,
		res,
		Cors({
			origin: '*',
			methods: ['GET', 'HEAD'],
		})
	);

	try {
		await connectToDatabase();

		switch (req.method) {
			case 'GET': {
				const user = await User.findOneAndDelete({
					_id: req.query.userId as string,
				}).exec();
				assertUser(user, req.query.userId as string);

				res.status(200).send(
					'successfully unsubscribed from email notifications'
				);

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
