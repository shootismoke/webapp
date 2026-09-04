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

import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Liveness probe for the container and the reverse proxy.
 *
 * Deliberately does not open the database: the site is almost entirely static
 * and should stay up even if the SQLite file is missing or unreadable. Only
 * the `/api/users` routes touch it.
 */
export default function health(
	_req: NextApiRequest,
	res: NextApiResponse
): void {
	res.status(200).json({ status: 'ok', uptime: process.uptime() });
}
