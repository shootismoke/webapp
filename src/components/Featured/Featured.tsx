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

import bbc from '../../../assets/images/media/bbc.png';
import circa from '../../../assets/images/media/circa.png';
import citylab from '../../../assets/images/media/citylab.png';
import huffpost from '../../../assets/images/media/huffpost.png';
import lifehacker from '../../../assets/images/media/lifehacker.png';
import slate from '../../../assets/images/media/slate.png';
import usbek from '../../../assets/images/media/usbek.png';

const medias = [
	{
		href: 'https://vimeo.com/269420780',
		image: bbc,
		slug: 'bbc',
	},
	{
		href:
			'https://www.citylab.com/environment/2018/04/how-much-are-you-smoking-by-breathing-urban-air/558827/',
		image: citylab,
		slug: 'citylab',
	},
	{
		href:
			'https://usbeketrica.com/article/une-appli-calcule-le-nombre-de-cigarettes-qu-on-fume-a-notre-insu-a-cause-de-la-pollution-de-l-air',
		image: usbek,
		slug: 'usbek',
	},
	{
		href:
			'https://vitals.lifehacker.com/see-your-citys-air-pollution-measured-in-daily-cigarett-1825659774',
		image: lifehacker,
		slug: 'lifehacker',
	},
	{
		href:
			'http://www.slate.fr/story/160929/cigarettes-equivalent-pollution-villes',
		image: slate,
		slug: 'slate',
	},
	{
		href:
			'https://www.huffingtonpost.com/entry/how-much-are-you-smoking-by-breathing-urban-air_us_5ae332e0e4b02baed1b9ccbc',
		image: huffpost,
		slug: 'huffpost',
	},
	{
		href:
			'https://www.circa.com/story/2018/05/03/science/an-app-tells-you-how-many-cigarettes-youre-smoking-when-you-breathe-the-polluted-air-in-your-city',
		image: circa,
		slug: 'circa',
	},
];

export function Featured(): React.ReactElement {
	return (
		<section className="container mx-auto my-12 px-24">
			<h2 className="text-xl">Featured at</h2>
			<div className="flex justify-around items-center flex-wrap">
				{medias.map((media) => (
					<a
						className="mx-8 my-4"
						href={media.href}
						key={media.slug}
						rel="noreferrer"
						target="_blank"
					>
						<img alt={media.slug} src={media.image} />
					</a>
				))}
			</div>
		</section>
	);
}
