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

import c from 'classnames';
import React from 'react';

import humidifier from '../../../assets/images/blogs/blog@3x.png';
import { Card } from '../Card';
import { Carousel } from '../Carousel';
import { Section } from '../Section';
import { SectionDivider } from '../SectionDivider';

interface Blog {
	image: string;
	subtitle: string;
	title: string;
	url: string;
}

const blogs: Blog[] = [
	{
		image: humidifier,
		subtitle: 'LifeHacker',
		title: 'Related 2 line blog title1',
		url: 'https://example.com',
	},
	{
		image: humidifier,
		subtitle: 'LifeHacker',
		title:
			'Related 2 line blog title very very very very very very very long',
		url: 'https://example.com',
	},
	{
		image: humidifier,
		subtitle: 'LifeHacker',
		title: 'Related 2 line blog title3',
		url: 'https://example.com',
	},
	{
		image: humidifier,
		subtitle: 'LifeHacker',
		title: 'Related 2 line blog title4',
		url: 'https://example.com',
	},
	{
		image: humidifier,
		subtitle: 'LifeHacker',
		title: 'Related 2 line blog title5',
		url: 'https://example.com',
	},
];

export function BlogSection(): React.ReactElement {
	return (
		<>
			<SectionDivider title="Latest Stories" />
			<Section
				className={c('pl-6 sm:pl-12 md:pl-24', 'lg:pr-24 pt-4')}
				noPadding={true}
			>
				<Carousel>
					{blogs.map((blog) => (
						<Card
							className="
							mr-3 w-40 h-64
							lg:mr-5 lg:w-48 lg:h-74
							flex-shrink-0"
							key={blog.title}
						>
							<img
								alt={blog.title}
								className="w-full h-42 lg:h-52"
								src={blog.image}
							/>

							<a href={blog.url} rel="noreferrer" target="_blank">
								<h4
									className="
									mt-3 mx-3 text-sm line-clamp-2
									hover:underline"
								>
									{blog.title}
								</h4>
							</a>
							<p className="mt-1 mx-3 text-xs text-gray-600">
								{blog.subtitle}
							</p>
						</Card>
					))}
				</Carousel>
			</Section>
		</>
	);
}
