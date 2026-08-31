// Sh**t! I Smoke
// Copyright (C) 2018-2021  Marcelo S. Coelho, Amaury M.

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

/**
 * Swear words, untranslated.
 */
const swearWords = [
	'home_swear_word_shoot',
	'home_swear_word_dang',
	'home_swear_word_darn',
	'home_swear_word_geez',
	'home_swear_word_omg',
	'home_swear_word_crap',
	'home_swear_word_arrgh',
];

/**
 * Return a random swear word, untranslated.
 *
 * @param cigaretteCount - The cigarette count for which we show the swear
 * word.
 */
export function getSwearWord(cigaretteCount: number): string {
	if (cigaretteCount <= 1) return 'home_cigarettes_oh';

	// Return a random swear word, untranslated.
	return swearWords[Math.floor(Math.random() * swearWords.length)];
}
