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

import bbc from '../../../assets/images/media/bbc@3x.png';
import circa from '../../../assets/images/media/circa@3x.png';
import citylab from '../../../assets/images/media/citylab@3x.png';
import highsnobiety from '../../../assets/images/media/highsnobiety@3x.png';
import hindustantimes from '../../../assets/images/media/hindustantimes@3x.png';
import huffpost from '../../../assets/images/media/huffpost@3x.png';
import lifehacker from '../../../assets/images/media/lifehacker@3x.png';
import nexo from '../../../assets/images/media/nexo@3x.png';
import pix from '../../../assets/images/media/pix@3x.png';
import rtbf from '../../../assets/images/media/rtbf@3x.png';
import slate from '../../../assets/images/media/slate@3x.png';
import usbek from '../../../assets/images/media/usbek@3x.png';
import { Section } from '../Section';
import { SectionDivider } from '../SectionDivider';

const medias = [
	{
		href:
			'https://www.citylab.com/environment/2018/04/how-much-are-you-smoking-by-breathing-urban-air/558827/',
		image: citylab,
		slug: 'citylab',
	},
	{
		href: 'https://vimeo.com/269420780',
		image: bbc,
		slug: 'bbc',
	},
	{
		href:
			'https://www.circa.com/story/2018/05/03/science/an-app-tells-you-how-many-cigarettes-youre-smoking-when-you-breathe-the-polluted-air-in-your-city',
		image: circa,
		slug: 'circa',
	},
	{
		href:
			'http://www.slate.fr/story/160929/cigarettes-equivalent-pollution-villes',
		image: slate,
		slug: 'slate',
	},
	{
		href:
			'https://www.rtbf.be/info/medias/detail_respirer-l-air-de-bruxelles-c-est-comme-fumer-2-5-cigarettes-jour-dit-cette-appli?id=9903635',
		image: rtbf,
		slug: 'rtbf',
	},
	{
		href:
			'https://www.hindustantimes.com/pune-news/planning-to-take-a-smoke-break-just-breathe-in-pune-s-air-which-equals-9-1-cigarettes-a-day/story-cAfTW4IKF2OmZ2lMgCVxFL.html',
		image: hindustantimes,
		slug: 'hindustantimes',
	},
	{
		href: undefined,
		image: nexo,
		slug: 'nexo',
	},
	{
		href:
			'https://vitals.lifehacker.com/see-your-citys-air-pollution-measured-in-daily-cigarett-1825659774',
		image: lifehacker,
		slug: 'lifehacker',
	},
	{
		href: 'https://www.highsnobiety.com/p/smoking-pollution-air-app/',
		image: highsnobiety,
		slug: 'highsnobiety',
	},
	{
		href:
			'https://www.huffingtonpost.com/entry/how-much-are-you-smoking-by-breathing-urban-air_us_5ae332e0e4b02baed1b9ccbc',
		image: huffpost,
		slug: 'huffpost',
	},
	{
		href: undefined,
		image: pix,
		slug: 'pix',
	},
	{
		href:
			'https://usbeketrica.com/article/une-appli-calcule-le-nombre-de-cigarettes-qu-on-fume-a-notre-insu-a-cause-de-la-pollution-de-l-air',
		image: usbek,
		slug: 'usbek',
	},
];

export function FeaturedSection(): React.ReactElement {
	return (
		<div className="pt-3">
			<SectionDivider title="Featured at" />
			<Section>
				<div className="lg:pt-3 grid grid-flow-row grid-cols-3 grid-rows-4 row-gap-6 col-gap-2 lg:grid-cols-6 lg:grid-rows-2 lg:col-gap-6">
					{medias.map((media) => (
						<a
							className="px-4 flex flex-row justify-center items-center"
							href={media.href}
							key={media.slug}
							rel="noreferrer"
							target="_blank"
						>
							<img
								alt={media.slug}
								className="w-32"
								src={media.image}
							/>
						</a>
					))}
				</div>
			</Section>
		</div>
	);
}
