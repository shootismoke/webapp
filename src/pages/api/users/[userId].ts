/**
 * This file is part of Sh**t! I Smoke.
 *
 * Copyright (C) 2018-2026  Marcelo S. Coelho, Amaury.
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
	assertUser,
	handlerError,
	runMiddleware,
} from '../../../backend/util';

export default async function apiUsersuserId(
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> {
	try {
		await runMiddleware(
			req,
			res,
			Cors({
				origin: allowedOrigins,
				methods: ['GET', 'DELETE', 'HEAD', 'PATCH'],
			})
		);
		assertHeader(req);

		switch (req.method) {
			/**
			 * GET /api/users/{userId}
			 * Get a user by id.
			 */
			case 'GET': {
				const user = User.findById(req.query.userId as string);
				assertUser(user, req.query.userId as string);

				res.status(200).json(user);

				break;
			}

			/**
			 * PATCH /api/users/{userId}
			 * Patch a user by id.
			 */
			case 'PATCH': {
				const user = User.findById(req.query.userId as string);
				assertUser(user, req.query.userId as string);

				// `User.update` merges the body onto the stored user and
				// throws a 400 if the result does not validate.
				res.status(200).json(User.update(user, req.body));

				break;
			}

			/**
			 * GET /api/users/{userId}
			 * Delete a user by id.
			 */
			case 'DELETE': {
				const user = User.deleteById(req.query.userId as string);
				assertUser(user, req.query.userId as string);

				res.status(200).json(user);

				break;
			}

			default:
				throw createHttpError(
					405,
					`Unknown request method: ${
						req.method || 'unknown method'
					} /api/users/{userId}`
				);
		}
	} catch (err) {
		handlerError(err, res);
	}
}
