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

import React from 'react';

import { Footer, Nav, Featured, Button } from '../components';

export default function Index(): React.ReactElement {
	return (
		<>
			<Nav />
			<section className="container mx-auto my-12 px-24">
				<h1>
					How much am I
					<br />
					smoking by breathing
					<br />
					urban air?
				</h1>
				<input
					className="border w-full"
					placeholder="Search any location"
					type="text"
				/>
				<p className="text-center">or</p>
				<Button>Show my current city</Button>
			</section>

			<Featured />
			<Footer />
		</>
	);
}
