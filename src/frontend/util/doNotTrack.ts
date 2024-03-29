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

/**
 * Check if browser has do not track enabled.
 * @see https://dev.to/corbindavenport/how-to-correctly-check-for-do-not-track-with-javascript-135d
 */
export function doNotTrack(): boolean {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-explicit-any
	if ((window as any).doNotTrack) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-explicit-any
		return (window as any).doNotTrack === '1';
	}
	if (navigator.doNotTrack) {
		return navigator.doNotTrack === 'yes' || navigator.doNotTrack === '1';
	}
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	if (navigator.msDoNotTrack) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		return navigator.msDoNotTrack === '1';
	}
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	if (typeof window.external?.msTrackingProtectionEnabled === 'function') {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		return window.external.msTrackingProtectionEnabled() as boolean; // eslint-disable-line @typescript-eslint/no-unsafe-call
	}

	return false;
}
