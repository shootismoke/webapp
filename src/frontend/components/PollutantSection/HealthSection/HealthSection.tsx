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

import React from 'react';

import { Tip, TipProps } from '../../Tip';

function HealthTip(props: TipProps): React.ReactElement {
	const { children, ...rest } = props;

	return (
		<Tip className="mt-8" {...rest}>
			{children}
		</Tip>
	);
}

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
			<HealthTip imgAlt="happy" imgSrc="/images/health/happy.svg" key={1}>
				<p className="type-400 md:type-500">
					Air quality is considered{' '}
					<span className="text-orange">satisfactory</span>, and air
					pollution poses little or no risk.
				</p>
			</HealthTip>,
			<HealthTip
				imgAlt="fitness"
				imgSrc="/images/health/fitness.svg"
				key={2}
			>
				<p className="type-400 md:type-500">
					<span className="text-orange">Enjoy</span> your usual
					outdoor activities.
				</p>
			</HealthTip>,
		];
	} else if (aqi <= 100) {
		return [
			<HealthTip imgAlt="happy" imgSrc="/images/health/happy.svg" key={1}>
				<p className="type-400 md:type-500">
					Air quality is{' '}
					<span className="text-orange">acceptable.</span> Enjoy your
					usual outdoor activities.
				</p>
			</HealthTip>,
			<HealthTip
				imgAlt="warning"
				imgSrc="/images/health/warning.svg"
				key={2}
			>
				<p className="type-400 md:type-500">
					For some pollutants there may be a{' '}
					<span className="text-orange">moderate health concern</span>{' '}
					for a very small number of people who are unusually
					sensitive to air pollution.
				</p>
			</HealthTip>,
		];
	} else if (aqi <= 150) {
		return [
			<HealthTip imgAlt="cry" imgSrc="/images/health/cry.svg" key={1}>
				<p className="type-400 md:type-500">
					Experiencing discomfort such as sore eyes, cough or sore
					throat?{' '}
					<span className="text-orange">
						Consider reducing outdoor activities.
					</span>
				</p>
			</HealthTip>,
			<HealthTip
				imgAlt="fitness"
				imgSrc="/images/health/fitness.svg"
				key={2}
			>
				<p className="type-400 md:type-500">
					It’s ok to be active outside, but we recommended to{' '}
					<span className="text-orange">
						avoid prolonged strenuous exercise.
					</span>
				</p>
			</HealthTip>,
		];
	} else if (aqi <= 200) {
		return [
			<HealthTip imgAlt="cry" imgSrc="/images/health/cry.svg" key={1}>
				<p className="type-400 md:type-500">
					Everyone experiencing discomfort such as sore eyes, cough or
					sore throat{' '}
					<span className="text-orange">
						should reduce physical exertion, particularly outdoors.
					</span>
				</p>
			</HealthTip>,
			<HealthTip imgAlt="pause" imgSrc="/images/health/pause.svg" key={2}>
				<p className="type-400 md:type-500">
					Avoid prolonged strenuous exercise, and{' '}
					<span className="text-orange">take more breaks</span> during
					outdoor activities.
				</p>
			</HealthTip>,
		];
	} else if (aqi <= 300) {
		return [
			<HealthTip
				imgAlt="warning"
				imgSrc="/images/health/warning.svg"
				key={1}
			>
				<p className="type-400 md:type-500">
					<span className="text-orange">Health alert:</span> everyone
					may experience more serious health effects.
				</p>
			</HealthTip>,
			<HealthTip imgAlt="house" imgSrc="/images/health/house.svg" key={2}>
				<p className="type-400 md:type-500">
					Everyone should{' '}
					<span className="text-orange">
						reduce outdoor activities,
					</span>{' '}
					especially vulnerable people.
				</p>
			</HealthTip>,
		];
	} else {
		return [
			<HealthTip
				imgAlt="warning"
				imgSrc="/images/health/warning.svg"
				key={1}
			>
				<p className="type-400 md:type-500">
					<span className="text-orange">Health alert:</span> Stop
					outdoor activities and move all activities indoors.
				</p>
			</HealthTip>,
			<HealthTip imgAlt="mask" imgSrc="/images/health/mask.svg" key={2}>
				<p className="type-400 md:type-500">
					If it is necessary to go out, please{' '}
					<span className="text-orange">wear a mask</span>.
				</p>
			</HealthTip>,
		];
	}
}

export function HealthSection(props: HealthSectionProps): React.ReactElement {
	const { aqi } = props;

	return <div>{tips(aqi)}</div>;
}
