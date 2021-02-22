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

import { captureException, init } from '@sentry/node';

if (process.env.NEXT_PUBLIC_SENTRY_API_KEY) {
	init({
		dsn: process.env.NEXT_PUBLIC_SENTRY_API_KEY,
	});
}

/**
 * Send an error to Sentry, or if sentry is not set up, just log it.
 *
 * @param error - Error to log
 */
function error(error: Error): void {
	console.error(error.message);

	if (process.env.NEXT_PUBLIC_SENTRY_API_KEY) {
		captureException(error);
	}
}

export const logger = {
	error,
};
