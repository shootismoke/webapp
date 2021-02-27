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

import { User } from '../../../../../backend/models';
import {
	assertUser,
	connectToDatabase,
	handlerError,
	runMiddleware,
} from '../../../../../backend/util';

export default async function (
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> {
	try {
		await runMiddleware(
			req,
			res,
			Cors({
				origin: '*', // Note: We allow all origins.
				methods: ['GET', 'HEAD'],
			})
		);
		// Note: We don't assertHeader on this route.

		switch (req.method) {
			/**
			 * GET /api/users/email/{userId}
			 * Delete a user by userId.
			 */
			case 'GET': {
				await connectToDatabase();

				// We unsubscribe the email notification by deleting the user.
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
				throw createHttpError(
					405,
					`Unknown request method: ${req.method || 'undefined'}`
				);
		}
	} catch (err) {
		handlerError(err, res);
	}
}
