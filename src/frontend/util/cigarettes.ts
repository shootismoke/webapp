/**
 * This file is part of Sh**t! I Smoke.
 *
 * Copyright (C) 2018-2021  Marcelo S. Coelho, Amaury Martiny.
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

import type { Pollutant } from '@shootismoke/convert';
import { Frequency } from '@shootismoke/ui/lib/context';

import { t } from '../localization';

/**
 * Convert a frequency to its equivalent period.
 *
 * @param frequency - The frequency to convert.
 */
export function frequencyToPeriod(frequency: Frequency): string {
	return frequency === 'daily'
		? 'day'
		: frequency === 'weekly'
		? 'week'
		: 'month';
}

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
	if (cigaretteCount <= 1) return t('home_cigarettes_oh');

	// Return a random swear word, untranslated.
	return t(swearWords[Math.floor(Math.random() * swearWords.length)]);
}

type PollutantData = { effects: string; name: string };

/**
 * Definitions and effects of various pollutants.
 *
 * @see https://www.sciencedirect.com/topics/chemistry/air-pollutant
 */
const pollutantData: Partial<Record<Pollutant, PollutantData>> = {
	bc: {
		effects:
			'Black carbon is a potent climate-warming component of particulate matter formed by the incomplete combustion of fossil fuels, wood and other fuels.',
		name: 'Black Carbon',
	},
	c6h6: {
		effects:
			'Hydrocarbons are the primary pollutants that produce photochemical smog.',
		name: 'Hydrocarbons',
	},
	// FIXME Add ch4
	// ch4: {
	// 	effects: 'Partly responsible for the atmospheric greenhouse effect.',
	// 	name: 'Methane',
	// },
	co: {
		effects:
			'Carbon monoxide reduces the oxygen-carrying capacity of the blood by combining with haemoglobin, thus deprives tissues of O2.',
		name: 'Carbon monoxide',
	},
	// FIXME Add co2
	// co2: {
	// 	effects: 'Partly responsible for the atmospheric greenhouse effect',
	// },
	no: {
		effects:
			'Nitrogen oxides cause eye, throat, and lung irritation. Primary pollutants that produce photochemical smog and acid rain, destroy ozone at the stratosphere.',
		name: 'Nitrogen oxides',
	},
	no2: {
		effects:
			'Nitrogen oxides cause eye, throat, and lung irritation. Primary pollutants that produce photochemical smog and acid rain, destroy ozone at the stratosphere.',
		name: 'Nitrogen oxides',
	},
	o3: {
		effects:
			'Ozone causes eye, throat, and lung irritation, impairs lung function.',
		name: 'Ozone',
	},
	pm10: {
		effects:
			'Particulate matters under 10μm (PM10), may cause breathing difficulties.',
		name: 'Particulates',
	},
	pm25: {
		effects:
			'Particulate matters under 2.5μm (PM2.5), may cause breathing difficulties.',
		name: 'Particulates',
	},
	so2: {
		effects:
			'Sulfur dioxide causes eye, throat, and lung irritation. Primary pollutants that produce acid rain.',
		name: 'Sulfur dioxide',
	},
};

export function getPollutantData(pollutant: Pollutant): PollutantData {
	const polData = pollutantData[pollutant];

	if (!polData) {
		throw new Error('All pollutants are in pollutantData. qed.');
	}

	return polData;
}
