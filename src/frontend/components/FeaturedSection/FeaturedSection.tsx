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

import Image from 'next/image';
import React from 'react';

import bbc from '../../../../assets/images/media/bbc.png';
import circa from '../../../../assets/images/media/circa.png';
import citylab from '../../../../assets/images/media/citylab.png';
import highsnobiety from '../../../../assets/images/media/highsnobiety.png';
import hindustantimes from '../../../../assets/images/media/hindustantimes.png';
import huffpost from '../../../../assets/images/media/huffpost.png';
import lifehacker from '../../../../assets/images/media/lifehacker.png';
import nexo from '../../../../assets/images/media/nexo.png';
import pix from '../../../../assets/images/media/pix.png';
import rtbf from '../../../../assets/images/media/rtbf.png';
import slate from '../../../../assets/images/media/slate.png';
import usbek from '../../../../assets/images/media/usbek.png';
import { logEvent } from '../../util';
import { Section } from '../Section';

const medias = [
	{
		href: 'https://www.citylab.com/environment/2018/04/how-much-are-you-smoking-by-breathing-urban-air/558827/',
		image: citylab,
		slug: 'citylab',
	},
	{
		href: 'https://vimeo.com/269420780',
		image: bbc,
		slug: 'bbc',
	},
	{
		href: 'https://www.circa.com/story/2018/05/03/science/an-app-tells-you-how-many-cigarettes-youre-smoking-when-you-breathe-the-polluted-air-in-your-city',
		image: circa,
		slug: 'circa',
	},
	{
		href: 'https://www.slate.fr/story/160929/cigarettes-equivalent-pollution-villes',
		image: slate,
		slug: 'slate',
	},
	{
		href: 'https://www.rtbf.be/info/medias/detail_respirer-l-air-de-bruxelles-c-est-comme-fumer-2-5-cigarettes-jour-dit-cette-appli?id=9903635',
		image: rtbf,
		slug: 'rtbf',
	},
	{
		href: 'https://www.hindustantimes.com/pune-news/planning-to-take-a-smoke-break-just-breathe-in-pune-s-air-which-equals-9-1-cigarettes-a-day/story-cAfTW4IKF2OmZ2lMgCVxFL.html',
		image: hindustantimes,
		slug: 'hindustantimes',
	},
	{
		href: undefined,
		image: nexo,
		slug: 'nexo',
	},
	{
		href: 'https://vitals.lifehacker.com/see-your-citys-air-pollution-measured-in-daily-cigarett-1825659774',
		image: lifehacker,
		slug: 'lifehacker',
	},
	{
		href: 'https://www.highsnobiety.com/p/smoking-pollution-air-app/',
		image: highsnobiety,
		slug: 'highsnobiety',
	},
	{
		href: 'https://www.huffingtonpost.com/entry/how-much-are-you-smoking-by-breathing-urban-air_us_5ae332e0e4b02baed1b9ccbc',
		image: huffpost,
		slug: 'huffpost',
	},
	{
		href: 'https://www.pix11.com/2018/05/09/how-much-do-you-smoke-app-translates-air-pollution-into-cigarettes-smoked/',
		image: pix,
		slug: 'pix',
	},
	{
		href: 'https://usbeketrica.com/article/une-appli-calcule-le-nombre-de-cigarettes-qu-on-fume-a-notre-insu-a-cause-de-la-pollution-de-l-air',
		image: usbek,
		slug: 'usbek',
	},
];

export function FeaturedSection(): React.ReactElement {
	return (
		<Section title="Featured at">
			<div className="grid grid-flow-row grid-cols-3 grid-rows-4 row-gap-6 col-gap-2 md:grid-cols-6 md:grid-rows-2 md:col-gap-6">
				{medias.map((media, index) => (
					<a
						className="px-4 flex flex-row justify-center items-center"
						href={media.href}
						key={media.slug}
						onClick={(): void =>
							logEvent('FeaturedSection.Media.Click', {
								index,
								href: media.href,
								slug: media.slug,
							})
						}
						rel="noreferrer"
						target="_blank"
					>
						<div className="next-images relative h-12 | w-32">
							<Image
								alt={media.slug}
								layout="fill"
								objectFit="contain"
								src={media.image}
							/>
						</div>
					</a>
				))}
			</div>
		</Section>
	);
}
