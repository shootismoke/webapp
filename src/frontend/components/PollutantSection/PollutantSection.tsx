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

import type { Pollutant } from '@shootismoke/convert';
import React from 'react';

import skull from '../../../../assets/images/icons/skull.svg';
import { getPollutantData } from '../../util';
import { Section } from '../Section';
import { Tip } from '../Tip';
import { HealthSection } from './HealthSection';

interface PollutantSectionProps {
	aqi: number;
	pollutant: Pollutant;
}

export function PollutantSection(
	props: PollutantSectionProps
): React.ReactElement {
	const { aqi, pollutant } = props;
	const polData = getPollutantData(pollutant);

	return (
		<Section title="Today's tips">
			<Tip imgAlt="skull" imgSrc={skull}>
				<p className="type-400 md:type-500">
					Your primary pollutant is{' '}
					<span className="text-orange">
						{polData.name} ({pollutant.toUpperCase()})*
					</span>
				</p>
			</Tip>

			<p className="mt-2 type-100 text-gray-600">*{polData.effects}</p>

			<HealthSection aqi={aqi} />
		</Section>
	);
}
