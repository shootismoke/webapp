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

import { ConversionBox } from '@shootismoke/ui';
import React from 'react';
import { useIntl } from 'react-intl';

import { Section } from '../Section';
import { SectionDivider } from '../SectionDivider';

export function HowSection(): React.ReactElement {
	const { formatMessage: t } = useIntl();

	return (
		<div className="pt-8">
			<SectionDivider title="Know more about air pollution" />

			<Section className="flex flex-col items-center">
				<div className="lg:mr-4 lg:w-1/2">
					<ConversionBox
						style={{ paddingVertical: 24 }}
						t={(id, replace): string => t({ id }, replace)}
					/>
				</div>
				<p className="lg:ml-4 lg:w-1/2 text-gray-600 text-xs">
					*Based on{' '}
					<a
						className="underline"
						href="http://berkeleyearth.org/air-pollution-and-cigarette-equivalence/"
						rel="noreferrer"
						target="_blank"
					>
						Berkeley Earth’s
					</a>{' '}
					findings about the equivalence between air pollution and
					cigarette smoking.
				</p>
			</Section>
		</div>
	);
}
