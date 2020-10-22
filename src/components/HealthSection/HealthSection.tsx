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

import cry from '../../../assets/images/health/cry.svg';
import fitness from '../../../assets/images/health/fitness.svg';
import happy from '../../../assets/images/health/happy.svg';
import mask from '../../../assets/images/health/mask.svg';
import pause from '../../../assets/images/health/pause.svg';
import house from '../../../assets/images/health/warning.svg';
import warning from '../../../assets/images/health/warning.svg';
import { Section } from '../Section';
import { Tip } from '../Tip';

interface HealthSectionProps {
	/**
	 * Air Quality Index.
	 */
	aqi: number;
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
			<Tip imgAlt="happy" imgSrc={happy} key={1}>
				<p className="leading-6 font-extrabold text-xl">
					Air quality is considered{' '}
					<span className="text-orange">satisfactory</span>, and air
					pollution poses little or no risk.
				</p>
			</Tip>,
			<Tip className="mt-4" imgAlt="fitness" imgSrc={fitness} key={2}>
				<p className="leading-6 font-extrabold text-xl">
					<span className="text-orange">Enjoy</span> your usual
					outdoor activities.
				</p>
			</Tip>,
		];
	} else if (aqi <= 100) {
		return [
			<Tip imgAlt="happy" imgSrc={happy} key={1}>
				<p className="font-extrabold text-xl">
					Air quality is{' '}
					<span className="text-orange">acceptable.</span> Enjoy your
					usual outdoor activities.
				</p>
			</Tip>,
			<Tip className="mt-4" imgAlt="warning" imgSrc={warning} key={2}>
				<p className="font-extrabold text-xl">
					For some pollutants there may be a{' '}
					<span className="text-orange">moderate health concern</span>{' '}
					for a very small number of people who are unusually
					sensitive to air pollution.
				</p>
			</Tip>,
		];
	} else if (aqi <= 150) {
		return [
			<Tip imgAlt="cry" imgSrc={cry} key={1}>
				<p className="font-extrabold text-xl">
					Experiencing discomfort such as sore eyes, cough or sore
					throat?{' '}
					<span className="text-orange">
						Consider reducing outdoor activities.
					</span>
				</p>
			</Tip>,
			<Tip className="mt-4" imgAlt="fitness" imgSrc={fitness} key={2}>
				<p className="font-extrabold text-xl">
					It’s ok to be active outside, but we recommended to{' '}
					<span className="text-orange">
						avoid prolonged strenuous exercise.
					</span>
				</p>
			</Tip>,
		];
	} else if (aqi <= 200) {
		return [
			<Tip imgAlt="cry" imgSrc={cry} key={1}>
				<p className="font-extrabold text-xl">
					Everyone experiencing discomfort such as sore eyes, cough or
					sore throat{' '}
					<span className="text-orange">
						should reduce physical exertion, particularly outdoors.
					</span>
				</p>
			</Tip>,
			<Tip className="mt-4" imgAlt="pause" imgSrc={pause} key={2}>
				<p className="font-extrabold text-xl">
					Avoid prolonged strenuous exercise, and{' '}
					<span className="text-orange">take more breaks</span> during
					outdoor activities.
				</p>
			</Tip>,
		];
	} else if (aqi <= 300) {
		return [
			<Tip imgAlt="warning" imgSrc={warning} key={1}>
				<p className="font-extrabold text-xl">
					<span className="text-orange">Health alert:</span> everyone
					may experience more serious health effects.
				</p>
			</Tip>,
			<Tip className="mt-4" imgAlt="house" imgSrc={house} key={2}>
				<p className="font-extrabold text-xl">
					Everyone should{' '}
					<span className="text-orange">
						reduce outdoor activities,
					</span>{' '}
					especially vulnerable people.
				</p>
			</Tip>,
		];
	} else {
		return [
			<Tip imgAlt="warning" imgSrc={warning} key={1}>
				<p className="font-extrabold text-xl">
					<span className="text-orange">Health alert:</span> Stop
					outdoor activities and move all activities indoors.
				</p>
			</Tip>,
			<Tip className="mt-6" imgAlt="mask" imgSrc={mask} key={2}>
				<p className="font-extrabold text-xl">
					If it is necessary to go out, please{' '}
					<span className="text-orange">wear a mask</span>.
				</p>
			</Tip>,
		];
	}
}

export function HealthSection(props: HealthSectionProps): React.ReactElement {
	const { aqi } = props;

	return <Section>{tips(aqi)}</Section>;
}
