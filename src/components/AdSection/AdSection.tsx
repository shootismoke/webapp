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
import { logEvent } from '../../util';
import { Card } from '../Card';
import { Carousel } from '../Carousel';
import { Section } from '../Section';
import { SectionDivider } from '../SectionDivider';

interface Ad {
	image: string;
	title: string;
	url: string;
}

const ads: Ad[] = [
	{
		image: humidifier,
		title: 'Coway AP-1512HH Mighty1',
		url: 'https://example.com',
	},
	{
		image: humidifier,
		title: 'Coway AP-1512HH Mighty2',
		url: 'https://example.com',
	},
	{
		image: humidifier,
		title: 'Coway AP-1512HH Mighty3',
		url: 'https://example.com',
	},
	{
		image: humidifier,
		title: 'Coway AP-1512HH Mighty4',
		url: 'https://example.com',
	},
	{
		image: humidifier,
		title: 'Coway AP-1512HH Mighty5',
		url: 'https://example.com',
	},
	{
		image: humidifier,
		title: 'Coway AP-1512HH Mighty6',
		url: 'https://example.com',
	},
	{
		image: humidifier,
		title: 'Coway AP-1512HH Mighty7',
		url: 'https://example.com',
	},
	{
		image: humidifier,
		title: 'Coway AP-1512HH Mighty8',
		url: 'https://example.com',
	},
	{
		image: humidifier,
		title: 'Coway AP-1512HH Mighty9',
		url: 'https://example.com',
	},
	{
		image: humidifier,
		title: 'Coway AP-1512HH Mighty10',
		url: 'https://example.com',
	},
];

export function AdSection(): React.ReactElement {
	return (
		<>
			<SectionDivider title="10 best air purifiers" />
			<Section
				className={c(
					'pl-6 sm:pl-12 md:pl-24',
					'sm:pr-12 md:pr-24 pt-4'
				)}
				noPadding={true}
			>
				<Carousel
					onPageLeftClick={(): void =>
						logEvent('AdSection.PageLeft.Click')
					}
					onPageRightClick={(): void =>
						logEvent('AdSection.PageRight.Click')
					}
				>
					{ads.map((ad, adIndex) => (
						<Card
							className="
							mr-3 w-40 h-64 p-3
							sm:mr-5 sm:p-6 sm:w-48 sm:h-74
							flex flex-col items-center flex-shrink-0"
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
							<a
								href={ad.url}
								onClick={(): void =>
									logEvent('AdSection.Ad.Click', {
										adIndex,
										adTitle: ad.title,
										adUrl: ad.url,
									})
								}
								rel="noreferrer"
								target="_blank"
							>
								<Button
									style={{
										paddingHorizontal: '0.5rem',
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
				<p
					className={c(
						'pr-6 sm:pr-12 md:pr-24',
						'mt-4 text-xs text-center text-gray-600'
					)}
				>
					All revenue from affiliate commisions is shared publicly
					here and used for website maintenance.
				</p>
			</Section>
		</>
	);
}
