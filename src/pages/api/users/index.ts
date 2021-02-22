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

import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';

import { User } from '../../../backend/models';
import {
	allowedOrigins,
	connectToDatabase,
	logger,
	runMiddleware,
	secretHeader,
} from '../../../backend/util';

async function users(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	await runMiddleware(
		req,
		res,
		Cors({
			origin: allowedOrigins,
			methods: ['POST', 'HEAD'],
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
