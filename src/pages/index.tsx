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

import { Link } from 'gatsby';
import React from 'react';

import {
	Featured,
	Footer,
	GpsButton,
	HowSection,
	Nav,
	SearchBar,
} from '../components';

export default function Index(): React.ReactElement {
	return (
		<>
			<Nav />
			<section className="container mx-auto my-12 px-24">
				<h1 className="font-gotham-black text-5xl">
					How much am I
					<br />
					<span className="text-orange">smoking</span> by breathing
					<br />
					urban air?
				</h1>
				<SearchBar />
				<p className="text-center">or</p>
				<GpsButton />
			</section>

			<section className="container mx-auto my-12 px-24">
				<h2 className="text-xl">Ranking of cities</h2>
				<ul>
					<li>
						<Link to="/city/paris">Paris</Link>
					</li>
				</ul>
			</section>

			<HowSection />
			<Featured />
			<Footer />
		</>
	);
}
