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

import { Cigarettes } from '../Cigarettes';

interface LoadingProps {
	className?: string;
}

export function Loading(props: LoadingProps): React.ReactElement {
	const { className } = props;

	return (
		<div className={className}>
			<Cigarettes cigarettes={1} />
			<h2 className="mt-8 font-gotham-black leading-12 lg:text-5xl text-3xl">
				Loading
				<br />
				<span className="text-orange">cough... cough...</span>
			</h2>
		</div>
	);
}
