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

import { Section } from '../Section';

interface SectionDividerProps {
	className?: string;
	title: string;
}

export function SectionDivider({
	className,
	title,
}: SectionDividerProps): React.ReactElement {
	return (
		<Section className={className}>
			<div className="flex flex-row items-center">
				<hr className="flex-grow border-t border-gray-200" />
				<h3 className="mx-4 tracking-wider text-xs font-extrabold uppercase">
					{title}
				</h3>
				<hr className="flex-grow border-gray-200" />
			</div>
		</Section>
	);
}
