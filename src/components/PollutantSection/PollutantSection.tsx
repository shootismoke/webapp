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

import { Pollutant } from '@shootismoke/convert';
import React from 'react';

import { Section } from '../Section';

interface PollutantSectionProps {
	pollutant: Pollutant;
}

/**
 * Definitions and effects of various pollutants.
 *
 * @see https://www.sciencedirect.com/topics/chemistry/air-pollutant
 */
const pollutantData: Partial<Record<
	Pollutant,
	{ effects: string; name: string }
>> = {
	c6h6: {
		effects: 'Primary pollutants that produce photochemical smog.',
		name: 'Hydrocarbons',
	},
	// FIXME Add ch4
	// ch4: {
	// 	effects: 'Partly responsible for the atmospheric greenhouse effect.',
	// 	name: 'Methane',
	// },
	co: {
		effects:
			'Reduces the oxygen-carrying capacity of the blood by combining with haemoglobin, thus deprives tissues of O2.',
		name: 'Carbon monoxide',
	},
	// FIXME Add co2
	// co2: {
	// 	effects: 'Partly responsible for the atmospheric greenhouse effect',
	// },
	no: {
		effects:
			'Cause eye, throat, and lung irritation. Primary pollutants that produce photochemical smog and acid rain, destroy ozone at the stratosphere.',
		name: 'Nitrogen oxides',
	},
	no2: {
		effects:
			'Cause eye, throat, and lung irritation. Primary pollutants that produce photochemical smog and acid rain, destroy ozone at the stratosphere.',
		name: 'Nitrogen oxides',
	},
	o3: {
		effects:
			'Causes eye, throat, and lung irritation, impairs lung function.',
		name: 'Ozone',
	},
	pm10: {
		effects: 'May cause breathing difficulties.',
		name: 'Particulates',
	},
	pm25: {
		effects: 'May cause breathing difficulties.',
		name: 'Particulates',
	},
	so2: {
		effects:
			'Causes eye, throat, and lung irritation. Primary pollutants that produce acid rain.',
		name: 'Sulfur dioxide',
	},
};

export function PollutantSection(
	props: PollutantSectionProps
): React.ReactElement {
	const { pollutant } = props;

	return (
		<Section className="lg:w-2/3">
			<h2 className="text-center font-gotham-black text-3xl">
				The main pollutant is{' '}
				<strong className="text-orange">
					{pollutant.toUpperCase()}
				</strong>
			</h2>
			{pollutantData[pollutant] && (
				<>
					<p>
						<span className="text-orange">What is it? </span>
						{pollutantData[pollutant]!.name}
					</p>
					<p>
						<span className="text-orange">
							Why does it matter?{' '}
						</span>
						{pollutantData[pollutant]!.effects}
					</p>
				</>
			)}
		</Section>
	);
}
