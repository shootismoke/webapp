/*
    This file is part of Sh**t! I Smoke.
    Copyright (C) 2018-2021  Marcelo S. Coelho, Amaury Martiny
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.
    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import c from 'classnames';
import Image from 'next/image';
import React from 'react';

import { Card, CardProps } from '../../Card';

const FALLBACK_IMAGE =
	'https://images.pexels.com/photos/1563256/pexels-photo-1563256.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260';

interface CityCardProps extends CardProps {
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
				<div className="next-images relative | h-full w-full object-cover">
					<Image
						alt={title}
						layout="fill"
						objectFit="cover"
						src={photoUrl || FALLBACK_IMAGE}
					/>
				</div>
			</div>

			<div className="min-w-0 flex flex-col justify-center">
				<p className="mb-3 type-400 text-orange">{title}</p>
				<p className="type-200 w-full truncate">{subtitle}</p>
				<p className="type-100 text-gray-600">{description}</p>
			</div>
		</Card>
	);
}
