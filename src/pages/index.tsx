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

import {
	DownloadSection,
	FeaturedSection,
	Footer,
	GpsButton,
	HowSection,
	Nav,
	RankingSection,
	SearchBar,
	Section,
	Seo,
} from '../components';

export default function Index(): React.ReactElement {
	return (
		<>
			<Seo title="Air Quality Data, in plain English" />
			<Nav />
			<Section>
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
			</Section>

			<RankingSection />
			<HowSection />
			<FeaturedSection />
			<DownloadSection />
			<Footer />
		</>
	);
}
