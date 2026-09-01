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

import {
	allowedOrigins,
	handlerError,
	runMiddleware,
} from '../../backend/util';
import { raceApiPromise } from '../../common/ui/util/api';

/**
 * How far back a measurement may be and still count as current.
 */
const RESULTS_WITHIN_HOURS = 6;

function assertCoordinate(raw: unknown, name: string): number {
	const value = Number(raw);
	if (typeof raw !== 'string' || raw === '' || Number.isNaN(value)) {
		throw createHttpError(400, `${name} must be a number`);
	}

	return value;
}

/**
 * GET /api/aq?lat=&lng=
 *
 * Air quality for a point, raced across our providers.
 *
 * This runs server-side so the provider credentials stay on the server: they
 * used to be NEXT_PUBLIC_* values compiled into the client bundle, which meant
 * anyone could read them out of the JavaScript and spend our rate limits.
 */
export default async function apiAq(
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
				} /api/aq`
			);
		}

		const latitude = assertCoordinate(req.query.lat, 'lat');
		const longitude = assertCoordinate(req.query.lng, 'lng');

		const dateFrom = new Date();
		dateFrom.setHours(dateFrom.getHours() - RESULTS_WITHIN_HOURS);

		const api = await raceApiPromise(
			{ latitude, longitude },
			{
				aqicn: { token: process.env.BACKEND_AQICN_TOKEN as string },
				openaq: {
					apiKey: process.env.BACKEND_OPENAQ_API_KEY as string,
					dateFrom,
					// Limiting to only fetch pm25. Sometimes, when we search
					// for all pollutants, the pm25 ones don't get returned
					// within the result limits.
					parameter: ['pm25'],
				},
			}
		);

		// Stations report hourly at best, so a few minutes of edge caching
		// costs nothing in freshness and takes real load off the providers.
		res.setHeader(
			'Cache-Control',
			'public, s-maxage=300, stale-while-revalidate=3600'
		);
		res.status(200).json(api);
	} catch (err) {
		handlerError(err, res);
	}
}
