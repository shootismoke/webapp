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

import React from 'react';

import mask from '../../../assets/images/icons/mask.svg';
import { Section } from '../Section';
import { Tip } from '../Tip';

interface HealthSectionProps {
	/**
	 * Air Quality Index.
	 */
	aqi: number;
}

/**
 * Health impact depending on AQI.
 *
 * @param aqi - Air Quality Index.
 * @see https://taqm.epa.gov.tw/taqm/en/b0201.html
 */
export function impact(aqi: number): string {
	if (aqi <= 50) {
		return 'Air quality is considered satisfactory, and air pollution poses little or no risk.';
	} else if (aqi <= 100) {
		return 'Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.';
	} else if (aqi <= 150) {
		return 'Members of sensitive groups may experience health effects. The general public is not likely to be affected.';
	} else if (aqi <= 200) {
		return 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.';
	} else if (aqi <= 300) {
		return 'Health alert: everyone may experience more serious health effects.';
	} else {
		return 'Health warnings of emergency conditions. The entire population is more likely to be affected.';
	}
}

/**
 * Health tips depending on AQI.
 *
 * @param aqi - Air Quality Index.
 * @see https://taqm.epa.gov.tw/taqm/en/b0201.html
 */
function tips(aqi: number): React.ReactElement[] {
	if (aqi <= 50) {
		return [
			<Tip imgAlt="mask" imgSrc={mask} key={1}>
				<h2 className="font-extrabold text-xl">
					<span className="text-orange">Enjoy</span> your usual
					outdoor activities.
				</h2>
			</Tip>,
		];
	} else if (aqi <= 100) {
		return [
			<Tip imgAlt="mask" imgSrc={mask} key={1}>
				<h2 className="font-extrabold text-xl">
					<span className="text-orange">Enjoy</span> your usual
					outdoor activities.
				</h2>
			</Tip>,
		];
	} else if (aqi <= 150) {
		return [
			<Tip imgAlt="mask" imgSrc={mask} key={1}>
				<h2 className="font-extrabold text-xl">
					Everyone experiencing discomfort such as sore eyes, cough or
					sore throat{' '}
					<span className="text-orange">
						should consider reducing
					</span>{' '}
					outdoor activities.
				</h2>
			</Tip>,
			<Tip className="mt-4" imgAlt="mask" imgSrc={mask} key={2}>
				<h2 className="font-extrabold text-xl">
					For students, it’s ok to be active outside, but are{' '}
					<span className="text-orange">recommended to reduce</span>{' '}
					prolonged strenuous exercise.
				</h2>
			</Tip>,
		];
	} else if (aqi <= 200) {
		return [
			<Tip imgAlt="mask" imgSrc={mask} key={1}>
				<h2 className="font-extrabold text-xl">
					Everyone experiencing discomfort such as sore eyes, cough or
					sore throat{' '}
					<span className="text-orange">should reduce</span> physical
					exertion, particularly outdoors.
				</h2>
			</Tip>,
			<Tip className="mt-4" imgAlt="mask" imgSrc={mask} key={2}>
				<h2 className="font-extrabold text-xl">
					Students should avoid prolonged strenuous exercise, and{' '}
					<span className="text-orange">take more breaks</span> during
					outdoor activities.
				</h2>
			</Tip>,
		];
	} else if (aqi <= 300) {
		return [
			<Tip imgAlt="mask" imgSrc={mask} key={1}>
				<h2 className="font-extrabold text-xl">
					Everyone <span className="text-orange">should reduce</span>{' '}
					outdoor activities.
				</h2>
			</Tip>,
			<Tip className="mt-4" imgAlt="mask" imgSrc={mask} key={2}>
				<h2 className="font-extrabold text-xl">
					Students{' '}
					<span className="text-orange">
						should stop outdoor activities
					</span>{' '}
					and move all activities and classes indoors.
				</h2>
			</Tip>,
		];
	} else {
		return [
			<Tip imgAlt="mask" imgSrc={mask} key={1}>
				<h2 className="font-extrabold text-xl">
					Everyone <span className="text-orange">should avoid</span>{' '}
					outdoor activities and keep doors and windows closed. If it
					is necessary to go out, please wear a mask.
				</h2>
			</Tip>,
			<Tip className="mt-6" imgAlt="mask" imgSrc={mask} key={2}>
				<h2 className="font-extrabold text-xl">
					Students{' '}
					<span className="text-orange">
						should stop outdoor activities
					</span>{' '}
					and move all activities and classes indoors.
				</h2>
			</Tip>,
		];
	}
}

export function HealthSection(props: HealthSectionProps): React.ReactElement {
	const { aqi } = props;

	return <Section className="max-w-screen-sm">{tips(aqi)}</Section>;
}
