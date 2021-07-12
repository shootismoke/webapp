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

import { captureException, init } from '@sentry/browser';

if (typeof window !== 'undefined') {
	init({
		dsn: process.env.NEXT_PUBLIC_SENTRY_API_KEY,
	});
}

// We don't send the following errors to Sentry to not pollute it.
const UNTRACKED_ERRORS = [
	// Weird amplitude error.
	'0 No request sent',
	// First time fetching a user
	'No user with',
];

/**
 * Capture an  error, and send it to Sentry.
 *
 * @param err - The error to capture.
 */
export function sentryException(err: Error): void {
	if (typeof window === 'undefined') {
		// Coming soon.
		// https://sentry.io/for/nextjs/
		return;
	}
	console.error(err);
	if (!UNTRACKED_ERRORS.some((msg) => err.message.includes(msg))) {
		captureException(err);
	}
}
