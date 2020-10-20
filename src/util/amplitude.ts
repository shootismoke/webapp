// Shoot! I Smoke
// Copyright (C) 2018-2020  Marcelo S. Coelho, Amaury Martiny

// Shoot! I Smoke is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Shoot! I Smoke is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Shoot! I Smoke.  If not, see <http://www.gnu.org/licenses/>.

import baseAmplitude, { AmplitudeClient } from 'amplitude-js';

let amplitude: AmplitudeClient | undefined = undefined;

if (typeof window !== 'undefined' && process.env.GATSBY_AMPLITUDE_API_KEY) {
	amplitude = baseAmplitude.getInstance();
	amplitude.init(process.env.GATSBY_AMPLITUDE_API_KEY);
}

/**
 *
 * @param event -
 */
export function logEvent(event: string): void {
	if (!amplitude) {
		return;
	}

	amplitude.logEvent(event, undefined, (responseCode, responseBody) => {
		console.log(responseBody, responseCode);
	});
}
