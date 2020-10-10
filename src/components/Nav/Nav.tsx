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

import logo from '@shootismoke/ui/assets/logos/transparent/transparent.png';
import { Link } from 'gatsby';
import React from 'react';

import download from '../../../assets/images/icons/download.svg';

export function Nav(): React.ReactElement {
	return (
		<header className="xl:mx-4 lg:mx-4 mx-2 mt-4">
			<nav className="flex flex-row justify-between">
				{/** Should be `items-center`, but `items-end` looks better */}
				<Link to="/">
					<img alt="logo" className="pr-2 w-12" src={logo} />
					<h2 className="font-extrabold leading-4">
						<span className="text-orange">Shoot!</span>
						<br />I Smoke
					</h2>
				</Link>
				<Link className="font-extrabold text-orange" to="#download">
					Download the app <img alt="download" src={download} />
				</Link>
			</nav>
		</header>
	);
}
