/**
 * This file is part of Sh**t! I Smoke.
 *
 * Copyright (C) 2018-2021  Marcelo S. Coelho, Amaury Martiny.
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

import c from 'classnames';
import React from 'react';

import { Card, CardProps } from '../../Card';

export function CarouselCard(props: CardProps): React.ReactElement {
	const { children, className, ...rest } = props;

	return (
		<Card
			className={c(
				`mb-6
				mr-3 w-40 h-60
				md:mr-5 md:w-48 md:h-70
				flex flex-col items-center flex-shrink-0`,
				className
			)}
			{...rest}
		>
			{children}
		</Card>
	);
}
