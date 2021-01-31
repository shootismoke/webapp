import { t } from '../localization';

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
 * Return a random swear word, translated.
 *
 * @param cigaretteCount - The cigarette count for which we show the swear
 * word.
 */
export function getSwearWord(cigaretteCount: number): string {
	if (cigaretteCount <= 1) return 'home_cigarettes_oh';

	// Return a random swear word, untranslated.
	return t(swearWords[Math.floor(Math.random() * swearWords.length)]);
}
