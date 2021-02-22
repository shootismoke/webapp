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

import type { NextApiRequest, NextApiResponse } from 'next';

export const secretHeader = 'x-shootismoke-secret';

export const allowedOrigins = [
	'http://localhost:3000',
	'https://shootismoke.app',
	/\.vercel\.app$/,
	/\.now\.sh$/,
];

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
export function runMiddleware<T>(
	req: NextApiRequest,
	res: NextApiResponse,
	fn: (
		req: NextApiRequest,
		res: NextApiResponse,
		t: (result: T) => void
	) => void
): Promise<T> {
	return new Promise((resolve, reject) => {
		fn(req, res, (result) => {
			if (result instanceof Error) {
				return reject(result);
			}

			return resolve(result);
		});
	});
}
