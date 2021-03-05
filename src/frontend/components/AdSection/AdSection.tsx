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

import { AusAir } from './AusAir';
import { Section } from '../Section';

interface Ad {
	image: string;
	title: string;
	affiliateLink: string;
}

export function AdSection(): React.ReactElement {
	return (
		<Section
			className="md:px-24"
			noPadding={true}
			title="Recommended mask"
			titleClassName="px-6 md:px-0"
		>
			<AusAir />
			<p className="mt-4 px-6 type-100 text-center text-gray-600">
				Buying products using the link above helps maintaining the site
				through commissions.
			</p>
		</Section>
	);
}
