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

import {
	allowedOrigins,
	handlerError,
	runMiddleware,
} from '../../backend/util';
import { geoapify } from '../../common/ui/util/geoapify';

/**
 * GET /api/geocode?q=&lat=&lng=
 *
 * Place search for the search bar, proxied so the Geoapify key stays on the
 * server rather than being compiled into the client bundle.
 */
export default async function apiGeocode(
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> {
	try {
		await runMiddleware(
			req,
			res,
			Cors({ origin: allowedOrigins, methods: ['GET', 'HEAD'] })
		);

		if (req.method !== 'GET' && req.method !== 'HEAD') {
			throw createHttpError(
				405,
				`Unknown request method: ${
					req.method || 'unknown method'
				} /api/geocode`
			);
		}

		const { q, lat, lng } = req.query;
		if (typeof q !== 'string' || !q.trim()) {
			throw createHttpError(400, 'q is required');
		}

		// Optional proximity bias.
		const gps =
			typeof lat === 'string' && typeof lng === 'string'
				? { latitude: Number(lat), longitude: Number(lng) }
				: undefined;

		const results = await geoapify(
			q,
			process.env.BACKEND_GEOAPIFY_API_KEY as string,
			gps && !Number.isNaN(gps.latitude) && !Number.isNaN(gps.longitude)
				? gps
				: undefined
		);

		res.setHeader(
			'Cache-Control',
			'public, s-maxage=3600, stale-while-revalidate=86400'
		);
		res.status(200).json(results);
	} catch (err) {
		handlerError(err, res);
	}
}
