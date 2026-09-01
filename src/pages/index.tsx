/**
 * This file is part of Sh**t! I Smoke.
 *
 * Copyright (C) 2018-2021  Marcelo S. Coelho, Amaury M.
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
import { City, citySlugs, getAllCities, logEvent } from '../frontend/util';

/**
 * How often, in seconds, Next regenerates these pages in the background.
 *
 * The city list is refreshed upstream every couple of hours. On Vercel a cron
 * triggered a full rebuild of all ~1000 pages to pick that up; self-hosted we
 * let ISR do it per page, on demand.
 */
export const REVALIDATE_SECONDS = 2 * 60 * 60;

export async function getStaticProps(): Promise<{
	props: { cities: City[] };
	revalidate: number;
}> {
	const cities = await getAllCities();

	return { props: { cities }, revalidate: REVALIDATE_SECONDS };
}

interface IndexProps {
	cities: City[];
}

export default function IndexPage(props: IndexProps): React.ReactElement {
	const { cities } = props;
	useEffect(() => logEvent('Page.Home.View'), []);

	return (
		<>
			<Seo pathname="/" title="Daily Air Quality, as Cigarettes" />
			<Nav />

			<Section>
				<H1 className="pt-3">
					<>
						How much am I
						<br />
						<span className="text-orange">
							smoking by breathing{' '}
						</span>
						<br className="hidden md:block" />
						urban air?
					</>
				</H1>
				<SearchBar citySlugs={citySlugs(cities)} className="mt-6" />
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
