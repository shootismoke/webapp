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

import c from 'classnames';
import React from 'react';

import { Card } from '../../Card';

const FALLBACK_IMAGE =
	'https://images.pexels.com/photos/1563256/pexels-photo-1563256.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260';

interface CityCardProps {
	description?: string;
	className?: string;
	photoUrl?: string;
	subtitle: string;
	title: string;
}

export function CityCard(props: CityCardProps): React.ReactElement {
	const { className, description, photoUrl, subtitle, title } = props;

	return (
		<Card className={c('h-26 pr-2 flex flex-row', className)}>
			<div className="mr-4 w-26 h-26 flex-shrink-0">
				<img
					className="h-full w-full object-cover"
					src={photoUrl || FALLBACK_IMAGE}
				/>
			</div>

			<div className="min-w-0 flex flex-col justify-center">
				<h4 className="mb-1 type-400 text-orange">{title}</h4>
				<p className="type-200 w-full truncate">{subtitle}</p>
				<p className="type-100 text-gray-600">{description}</p>
			</div>
		</Card>
	);
}
