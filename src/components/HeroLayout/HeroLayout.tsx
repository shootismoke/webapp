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

interface HeroLayoutrops {
	cover?: React.ReactElement;
	coverClassName?: string;
	title?: React.ReactElement;
	titleClassname?: string;
}

export function HeroLayout(props: HeroLayoutrops): React.ReactElement {
	const { cover, coverClassName, title, titleClassname } = props;

	return (
		<>
			<div className={c('h-32', coverClassName)}>{cover}</div>
			<div className={c('mt-4', titleClassname)}>{title}</div>
		</>
	);
}
