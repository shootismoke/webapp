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

import { SearchBar } from '../SearchBar';

interface NavProps {
	showSearchBar?: boolean;
}

export function Nav(props: NavProps): React.ReactElement {
	const { showSearchBar } = props;

	return (
		<header>
			<nav className="flex justify-between items-center">
				<div className="flex">
					<Link className="flex items-center" to="/">
						<img alt="logo" className="w-12" src={logo} />
						<h1 className="font-gotham-black">Sh**t! I Smoke</h1>
					</Link>
					{showSearchBar && <SearchBar className="w-24" />}
				</div>

				<div className="flex">
					<p className="ml-4">Mobile</p>
					<p className="ml-4">Share</p>
					<p className="ml-4">F.A.Q.</p>
				</div>
			</nav>
		</header>
	);
}
