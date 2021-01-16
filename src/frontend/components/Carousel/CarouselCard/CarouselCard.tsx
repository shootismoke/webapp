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
