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

import c from 'classnames';
import React from 'react';

interface TipProps {
	children:
		| React.ReactElement
		| undefined
		| (React.ReactElement | undefined)[];
	className?: string;
	imgAlt: string;
	imgSrc: string;
}

export function Tip({
	children,
	className,
	imgAlt,
	imgSrc,
}: TipProps): React.ReactElement {
	return (
		<div className={c('flex flex-row items-center', className)}>
			<img
				alt={imgAlt}
				className="mr-4"
				src={imgSrc}
				style={{ minWidth: '42px' }}
			></img>

			{children}
		</div>
	);
}
