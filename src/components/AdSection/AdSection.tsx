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

import { Button } from '@shootismoke/ui';
import c from 'classnames';
import React from 'react';

import humidifier from '../../../assets/images/ads/humidifier@3x.png';
import { Card } from '../Card';
import { Section, sectionHorizontalPadding } from '../Section';
import { SectionDivider } from '../SectionDivider';
import { Carousel } from '../Carousel';

interface Ad {
	image: string;
	title: string;
	url: string;
}

const ads: Ad[] = [
	{
		image: humidifier,
		title: 'Coway AP-1512HH Mighty',
		url: 'https://example.com',
	},
	{
		image: humidifier,
		title: 'Coway AP-1512HH Mighty',
		url: 'https://example.com',
	},
	{
		image: humidifier,
		title: 'Coway AP-1512HH Mighty',
		url: 'https://example.com',
	},
	{
		image: humidifier,
		title: 'Coway AP-1512HH Mighty',
		url: 'https://example.com',
	},
	{
		image: humidifier,
		title: 'Coway AP-1512HH Mighty',
		url: 'https://example.com',
	},
	{
		image: humidifier,
		title: 'Coway AP-1512HH Mighty',
		url: 'https://example.com',
	},
	{
		image: humidifier,
		title: 'Coway AP-1512HH Mighty',
		url: 'https://example.com',
	},
	{
		image: humidifier,
		title: 'Coway AP-1512HH Mighty',
		url: 'https://example.com',
	},
	{
		image: humidifier,
		title: 'Coway AP-1512HH Mighty',
		url: 'https://example.com',
	},
	{
		image: humidifier,
		title: 'Coway AP-1512HH Mighty',
		url: 'https://example.com',
	},
];

/**
 * Same padding as the Section component, but only applied to left.
 */
export const leftSectionPadding = sectionHorizontalPadding.replace(/px/g, 'pl');

export function AdSection(): React.ReactElement {
	return (
		<>
			<SectionDivider title="10 best air purifiers" />
			<Section
				className={c(leftSectionPadding, 'lg:pr-24 pt-4')}
				noPadding={true}
			>
				<Carousel>
					{ads.map((ad) => (
						<Card
							className="mr-5 px-8 py-8 w-48 h-72 flex-shrink-0"
							key={ad.title}
						>
							<img
								alt={ad.title}
								className="px-2"
								src={ad.image}
							/>
							<h4 className="mt-4 mb-3 text-sm text-center">
								{ad.title}
							</h4>
							<a href={ad.url} rel="noreferrer" target="_blank">
								<Button
									style={{
										paddingHorizontal: '0.75rem',
										paddingVertical: '0.25rem',
										width: 'max-content',
									}}
								>
									VIEW PRICE
								</Button>
							</a>
						</Card>
					))}
				</Carousel>
			</Section>
		</>
	);
}
