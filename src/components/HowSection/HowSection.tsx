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

import { ConversionBox } from '@shootismoke/ui';
import React from 'react';
import { useIntl } from 'react-intl';

import { Section } from '../Section';

export function HowSection(): React.ReactElement {
	const { formatMessage: t } = useIntl();
	return (
		<Section>
			<h2 className="text-xl">How is the number calculated?</h2>
			<div className="lg:flex lg:items-center">
				<div className="lg:mr-4 lg:w-1/2">
					<ConversionBox
						style={{ paddingVertical: 24 }}
						t={(id, replace): string => t({ id }, replace)}
					/>
				</div>
				<p className="lg:ml-4 lg:w-1/2">
					Based on{' '}
					<a
						href="http://berkeleyearth.org/air-pollution-and-cigarette-equivalence/"
						rel="noreferrer"
						target="_blank"
					></a>
					Berkeley Earth’s findings about the equivalence between air
					pollution and cigarette smoking. Some more SEO optimized
					text here.
				</p>
			</div>
		</Section>
	);
}
