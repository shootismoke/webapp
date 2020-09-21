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

import sadFace from '@shootismoke/ui/assets/images/error@3x.png';
import React from 'react';

interface SadFaceProps {
	className?: string;
	message?: string;
}

export function SadFace(props: SadFaceProps): React.ReactElement {
	const { className, message } = props;

	return (
		<div className={className}>
			<img alt="error" className="h-32" src={sadFace} />
			<h2 className="mt-8 font-gotham-black leading-12 lg:text-5xl text-3xl">
				Cannot load<br></br>
				<span className="text-orange">your cigarettes</span>
			</h2>
			<p className="mt-8 text-gray-600 text-xs">{message}</p>
		</div>
	);
}
