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

import React from 'react';

import { Section } from '../Section';

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
function impact(aqi: number): string {
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
			<p key={1}>
				<span className="text-orange">Enjoy</span> your usual outdoor
				activities.
			</p>,
		];
	} else if (aqi <= 100) {
		return [
			<p key={1}>
				<span className="text-orange">Enjoy</span> your usual outdoor
				activities.
			</p>,
		];
	} else if (aqi <= 150) {
		return [
			<p key={1}>
				Everyone experiencing discomfort such as sore eyes, cough or
				sore throat{' '}
				<span className="text-orange">should consider reducing</span>{' '}
				outdoor activities.
			</p>,
			<p key={2}>
				For students, it’s ok to be active outside, but are{' '}
				<span className="text-orange">recommended to reduce</span>{' '}
				prolonged strenuous exercise.
			</p>,
		];
	} else if (aqi <= 200) {
		return [
			<p key={1}>
				Everyone experiencing discomfort such as sore eyes, cough or
				sore throat <span className="text-orange">should reduce</span>{' '}
				physical exertion, particularly outdoors.
			</p>,
			<p key={2}>
				Students should avoid prolonged strenuous exercise, and{' '}
				<span className="text-orange">take more breaks</span> during
				outdoor activities.
			</p>,
		];
	} else if (aqi <= 300) {
		return [
			<p key={1}>
				Everyone <span className="text-orange">should reduce</span>{' '}
				outdoor activities.
			</p>,
			<p key={2}>
				Students{' '}
				<span className="text-orange">
					should stop outdoor activities
				</span>{' '}
				and move all activities and classes indoors.
			</p>,
		];
	} else {
		return [
			<p key={1}>
				Everyone <span className="text-orange">should avoid</span>{' '}
				outdoor activities and keep doors and windows closed. If it is
				necessary to go out, please wear a mask.
			</p>,
			<p key={2}>
				Students{' '}
				<span className="text-orange">
					should stop outdoor activities
				</span>{' '}
				and move all activities and classes indoors.
			</p>,
		];
	}
}

export function HealthSection(props: HealthSectionProps): React.ReactElement {
	const { aqi } = props;

	return (
		<Section className="lg:w-2/3 text-center">
			<h2 className="font-gotham-black text-3xl">{tips(aqi)[0]}</h2>
			<p>{impact(aqi)}</p>
		</Section>
	);
}
