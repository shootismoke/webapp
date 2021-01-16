/*
    This file is part of Sh**t! I Smoke.
    Copyright (C) 2018-2021  Marcelo S. Coelho, Amaury Martiny
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.
    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import timezones from 'timezones.json';

/**
 * Math modulo. Javascript sometimes feels like a very cruel joke.
 *
 * @see https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
 * @example
 * ```typescript
 * -13 % 64; // -13
 * mod(-13, 64); // 51
 * ```
 */
function mod(n: number, m: number): number {
	return ((n % m) + m) % m;
}

/**
 * Is DST observed right now?
 *
 * @see https://stackoverflow.com/questions/11887934/how-to-check-if-the-dst-daylight-saving-time-is-in-effect-and-if-it-is-whats
 */
function isDstObserved(now = new Date()): boolean {
	const jan = new Date(now.getFullYear(), 0, 1);
	const jul = new Date(now.getFullYear(), 6, 1);

	const stdTimezoneOffset = Math.max(
		jan.getTimezoneOffset(),
		jul.getTimezoneOffset()
	);

	return now.getTimezoneOffset() < stdTimezoneOffset;
}

/**
 * Find all the timezones whose current hour is `hour`.
 *
 * @param hour - The hour we would like to find the timezones.
 * @param now - The base hour, for example use `new Date()` to find the
 * timzones at `hour` right now.
 */
export function findTimezonesAt(hour: number, now: Date): string[] {
	// Get offet in the [-10, 13] range
	let offset = mod(hour - now.getUTCHours(), 24);
	if (offset > 13) {
		offset -= 24;
	}

	// Is DST currently observed?
	const isDstNow = isDstObserved();

	const tzs = timezones.filter(
		(tz) =>
			offset ===
			(tz.isdst && !isDstNow
				? Math.floor(tz.offset - 1) // Now is not DST, we remove an hour to this tz that's following DST
				: Math.floor(tz.offset))
	);

	return tzs.map(({ utc }) => utc).flat();
}
