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

/**
 * Capitalize a string.
 *
 * @param s - The string to capitalize
 */
function capitalize(s: string): string {
	return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Decide on a SEO title for the page.
 */
export function getSeoTitle(
	cigarettes?: number,
	slug?: string,
	reverseGeoName?: string
): string {
	if (!cigarettes) {
		return slug
			? `${capitalize(slug)} Air Pollution`
			: `City Air Pollution`;
	}

	// Round to 1 decimal
	const cigarettesRounded = Math.round(cigarettes * 10) / 10;

	return slug
		? `${capitalize(
				slug
		  )} Air Pollution: ${cigarettesRounded} cigarettes per day`
		: `${reverseGeoName} Air Pollution: ${cigarettesRounded} cigarettes per day`;
}
