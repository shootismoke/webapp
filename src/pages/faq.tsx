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

import { Footer, H1, Nav, Section, Seo } from '../components';
import { logEvent } from '../util';

interface FaqSectionProps {
	children: React.ReactElement;
	title: string;
}

function FaqSection(props: FaqSectionProps): React.ReactElement {
	const { children, title } = props;

	return (
		<Section>
			<H1 className="pt-3 text-orange">{title}</H1>
			{children}
		</Section>
	);
}

export default function Faq(): React.ReactElement {
	useEffect(() => logEvent('Page.Faq.View'), []);

	return (
		<>
			<Seo title="F.A.Q." />
			<Nav />

			<FaqSection
				title={'about.how_to_calculate_number_of_cigarettes.title'}
			>
				<p>{'how_to_calculate_number_of_cigarettes.message'}</p>
			</FaqSection>
			<Footer />
		</>
	);
}
