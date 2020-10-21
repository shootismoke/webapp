// Sh**t! I Smoke
// Copyright (C) 2018-2020  Marcelo S. Coelho, Amaury Martiny

// Sh**t! I Smoke is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Sh**t! I Smoke is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Sh**t! I Smoke.  If not, see <http://www.gnu.org/licenses/>.

import { captureException } from '@sentry/core';

/**
 * Log an event on Amplitude.
 *
 * @param event - The event name to log.
 */
export function logEvent(
	event: string,
	properties?: Record<string, string | number | undefined>
): void {
	if (!window.amplitude) {
		return;
	}

	window.amplitude
		.getInstance()
		.logEvent(
			event,
			{ ...properties, url: window.location.href },
			(responseCode, responseBody) => {
				if (responseCode < 200 || responseCode >= 300) {
					captureException(
						new Error(
							`Amplitude callback: ${responseCode} ${responseBody}`
						)
					);
				}
			}
		);
}
