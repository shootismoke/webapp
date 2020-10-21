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

import React, { useEffect } from 'react';

import {
	AboutSection,
	AdSection,
	BlogSection,
	DownloadSection,
	FeaturedSection,
	Footer,
	GpsButton,
	H1,
	Nav,
	RankingSection,
	SearchBar,
	Section,
	Seo,
} from '../components';
import { logEvent } from '../util';

export default function Index(): React.ReactElement {
	useEffect(() => logEvent('Page.Home.View'), []);

	return (
		<>
			<Seo title="Air Quality Data, in plain English" />
			<Nav />
			<Section>
				<H1 className="pt-3">
					<>
						How much am I
						<br />
						<span className="text-orange">
							smoking by breathing{' '}
						</span>
						<br className="hidden sm:block" />
						urban air?
					</>
				</H1>
				<SearchBar className="mt-5" showGps={false} />

				<div className="my-3 flex flex-row items-center">
					<hr className="flex-grow border-t border-gray-200" />
					<p className="mx-4 text-gray-600">or</p>
					<hr className="flex-grow border-gray-200" />
				</div>
				<GpsButton />
			</Section>

			<RankingSection />
			<AboutSection />
			<AdSection />
			<FeaturedSection />
			<BlogSection />
			<DownloadSection />
			<Footer />
		</>
	);
}
