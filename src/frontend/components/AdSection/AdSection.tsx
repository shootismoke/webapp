/*
    This file is part of Sh**t! I Smoke.
    Copyright (C) 2018-2021  Marcelo S. Coelho, Amaury Martiny
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.
    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import c from 'classnames';
import Image from 'next/image';
import React from 'react';

import { logEvent } from '../../util';
import { Button } from '../Button';
import { Carousel, CarouselCard } from '../Carousel';
import { Section } from '../Section';

interface Ad {
	image: string;
	title: string;
	affiliateLink: string;
}

const ads: Ad[] = [
	{
		image: 'https://m.media-amazon.com/images/I/41iXxxBSFML.jpg',
		title: 'Dyson Pure Hot + Cool',
		affiliateLink:
			'https://www.amazon.com/gp/product/B07KXBX32V/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B07KXBX32V&linkCode=as2&tag=shootismoke-20&linkId=06d44587fa4880918c4984dd5443721f',
	},
	{
		image: 'https://m.media-amazon.com/images/I/41MmT7Y3HDL.jpg',
		title: 'Levoit Core 300 Compact Purifier',
		affiliateLink:
			'https://www.amazon.com/gp/product/B07VVK39F7/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B07VVK39F7&linkCode=as2&tag=shootismoke-20&linkId=da3e44c51c3b6a9240c911a2b842c152',
	},
	{
		image: 'https://m.media-amazon.com/images/I/31XCJuVajML.jpg',
		title: 'Blueair 211+ Air Purifier 3 Stage',
		affiliateLink:
			'https://www.amazon.com/gp/product/B073WJL99W/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B073WJL99W&linkCode=as2&tag=shootismoke-20&linkId=7ca51140e175392191fb63020e81946d',
	},
	{
		image: 'https://m.media-amazon.com/images/I/415wavSYAPL.jpg',
		title: 'Bissell air320 Smart Air Purifier',
		affiliateLink:
			'https://www.amazon.com/gp/product/B07XTX5RJJ/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B07XTX5RJJ&linkCode=as2&tag=shootismoke-20&linkId=15ca435b9c13e0069d713975475df694',
	},
	{
		image: 'https://m.media-amazon.com/images/I/51HTOhjvUaL.jpg',
		title: 'Coway Airmega 200M True Hepa',
		affiliateLink:
			'https://www.amazon.com/gp/product/B0856PHMMK/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B0856PHMMK&linkCode=as2&tag=shootismoke-20&linkId=69d85a5b4518091def104f634ede9938',
	},
	{
		image: 'https://m.media-amazon.com/images/I/31hAZEBbUSL.jpg',
		title: 'Molekule Air Mini Small Room',
		affiliateLink:
			'https://www.amazon.com/gp/product/B07ZPLXB54/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B07ZPLXB54&linkCode=as2&tag=shootismoke-20&linkId=d342754cf333e9eed99f72f41c099331',
	},
	{
		image: 'https://m.media-amazon.com/images/I/31skhhngBoL.jpg',
		title: 'Winix 5500-2 Air Purifier',
		affiliateLink:
			'https://www.amazon.com/gp/product/B01D8DAYII/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B01D8DAYII&linkCode=as2&tag=shootismoke-20&linkId=51b96c28cd1ce2991ed9a34821401489',
	},
	{
		image: 'https://m.media-amazon.com/images/I/41mb1dyIEUL.jpg',
		title: 'Germ Guardian AC4825E',
		affiliateLink:
			'https://www.amazon.com/gp/product/B004VGIGVY/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B004VGIGVY&linkCode=as2&tag=shootismoke-20&linkId=84aeb92600abe0ef2195fbde3ba1478a',
	},
	{
		image: 'https://m.media-amazon.com/images/I/41NH1hfkC2L.jpg',
		title: 'Toshiba Smart WiFi Air Purifier',
		affiliateLink:
			'https://www.amazon.com/gp/product/B088LQKL5K/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B088LQKL5K&linkCode=as2&tag=shootismoke-20&linkId=05342b3864d8238c18db9fcecd2902f2',
	},
	{
		image: 'https://m.media-amazon.com/images/I/3187svuKBZL.jpg',
		title: 'Medify Air MA-15 Air Purifier',
		affiliateLink:
			'https://www.amazon.com/gp/product/B089CBRBVX/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B089CBRBVX&linkCode=as2&tag=shootismoke-20&linkId=b824ed14f82bba6764a393e6292e9160',
	},
];

export function AdSection(): React.ReactElement {
	return (
		<Section
			className="md:px-24"
			noPadding={true}
			title="10 best air purifiers"
			titleClassName="px-6 md:px-0"
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
					<a
						href={ad.affiliateLink}
						key={ad.title}
						onClick={(): void =>
							logEvent('AdSection.Ad.Click', {
								adIndex,
								adTitle: ad.title,
								affiliateLink: ad.affiliateLink,
							})
						}
						rel="noreferrer"
						target="_blank"
					>
						<CarouselCard
							className={c(
								'p-3 md:p-6',
								adIndex === 0 && 'ml-3 md:ml-0'
							)}
						>
							<div className="next-images relative w-full | px-2 h-36 object-cover">
								<Image
									alt={ad.title}
									layout="fill"
									objectFit="contain"
									src={ad.image}
								/>
							</div>

							<h3 className="mt-4 mb-3 type-200 text-center">
								{ad.title}
							</h3>

							<Button className="px-3 py-1">
								<span className="type-300 text-orange">
									VIEW PRICE
								</span>
							</Button>
						</CarouselCard>
					</a>
				))}
			</Carousel>
			<p className="px-6 type-100 text-center text-gray-600">
				All revenue from affiliate commissions is used to support the
				app&apos;s maintenance costs.
			</p>
		</Section>
	);
}
