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

import type { AmplitudeClient } from 'amplitude-js';

import { doNotTrack } from './doNotTrack';
import { sentryException } from './sentry';

let client: AmplitudeClient;
if (typeof window !== 'undefined') {
	/* eslint-disable */
	const amplitude = require('amplitude-js');
	client = amplitude.getInstance();
	/* eslint-enable */
	client.init(
		process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY as string,
		undefined,
		{
			includeGclid: true,
			includeReferrer: true,
			includeUtm: true,
			// We never track PII.
			trackingOptions: {
				city: false,
				country: true,
				carrier: false,
				device_manufacturer: false,
				device_model: false,
				dma: false,
				ip_address: false,
				language: true,
				os_name: true,
				os_version: true,
				platform: true,
				region: false,
				version_name: true,
			},
		}
	);
}

/**
 * Log an event on Amplitude.
 *
 * @param event - The event name to log.
 */
export function logEvent(
	event: string,
	properties?: Record<string, string | number | undefined>
): void {
	if (doNotTrack()) {
		return;
	}

	if (client) {
		client.logEvent(
			event,
			{
				...properties,
				origin: window.location.origin,
				pathname: window.location.pathname,
				url: window.location.href,
			},
			(responseCode, responseBody) => {
				if (responseCode < 200 || responseCode >= 300) {
					sentryException(
						new Error(
							`Amplitude callback: ${responseCode} ${responseBody}`
						)
					);
				}
			}
		);
	}

	// We also try Cabin.
	// eslint-disable-next-line
	if ((window as any).cabin) {
		// eslint-disable-next-line
		(window as any).cabin.event(event).catch((err: Error) => {
			sentryException(err);
		});
	}
}
