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
import createHttpError from 'http-errors';
import { NextApiRequest, NextApiResponse } from 'next';

import { User } from '../../../backend/models';
import {
	allowedOrigins,
	assertHeader,
	connectToDatabase,
	handlerError,
	runMiddleware,
} from '../../../backend/util';

export default async function (
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> {
	try {
		await runMiddleware(
			req,
			res,
			Cors({
				origin: allowedOrigins,
				methods: ['POST', 'HEAD'],
			})
		);
		assertHeader(req);

		switch (req.method) {
			/**
			 * POST /api/users
			 * Create a new user.
			 */
			case 'POST': {
				await connectToDatabase();

				const user = new User(req.body);
				await user.save().catch((err: Error) => {
					// Throw 400 on validation error.
					throw createHttpError(400, err.message);
				});

				res.status(201).json(user);

				break;
			}

			default:
				throw createHttpError(
					405,
					`Unknown request method: ${
						req.method || 'unknown method'
					} /api/users`
				);
		}
	} catch (err) {
		handlerError(err, res);
	}
}
