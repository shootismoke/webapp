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

import logo from '@shootismoke/ui/assets/logos/transparent/transparent.png';
import { Link } from 'gatsby';
import React from 'react';

export function Nav(): React.ReactElement {
	return (
		<header className="mx-2 mt-4">
			<nav className="flex justify-between items-center">
				<div className="flex w-1/2">
					{/** Should be `items-center`, but `items-end` looks better */}
					<Link className="flex flex-grow items-end" to="/">
						<img alt="logo" className="pr-2 w-12" src={logo} />
						<h2 className="font-gotham-black leading-4">
							<span className="text-orange">Shoot!</span>
							<br />I Smoke
						</h2>
					</Link>
				</div>
			</nav>
		</header>
	);
}
