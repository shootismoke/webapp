/**
 * This file is part of Sh**t! I Smoke.
 *
 * Copyright (C) 2018-2021  Marcelo S. Coelho, Amaury Martiny.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React, { useEffect } from 'react';

import {
	AboutSection,
	AdSection,
	BlogSection,
	DownloadSection,
	FeaturedSection,
	Footer,
	H1,
	Nav,
	RankingSection,
	SearchBar,
	Section,
	Seo,
} from '../frontend/components';
import { City, getAllCities, logEvent } from '../frontend/util';

export async function getStaticProps(): Promise<{ props: { cities: City[] } }> {
	const cities = await getAllCities();

	return { props: { cities } };
}

interface NotFoundProps {
	cities: City[];
}

export default function NotFoundPage(props: NotFoundProps): React.ReactElement {
	const { cities } = props;
	useEffect(() => logEvent('Page.404.View'), []);

	return (
		<>
			<Seo pathname="/404" title="Page Not Found" />
			<Nav />

			<Section>
				<H1>
					<>
						Shoot! It&apos;s a 404.
						<br />
						<span className="text-orange">
							Something went wrong...
						</span>
					</>
				</H1>
				<SearchBar cities={cities} className="mt-6" />
			</Section>

			<RankingSection cities={cities} />
			<AdSection />
			<AboutSection />
			<FeaturedSection />
			<BlogSection />
			<DownloadSection />
			<Footer />
		</>
	);
}
