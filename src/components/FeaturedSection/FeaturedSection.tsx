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

import { graphql, useStaticQuery } from 'gatsby';
import Img, { FluidObject } from 'gatsby-image';
import React from 'react';

import { logEvent } from '../../util';
import type { GatsbyFileNode } from '../BlogSection';
import { Section } from '../Section';

const medias = [
	{
		href:
			'https://www.citylab.com/environment/2018/04/how-much-are-you-smoking-by-breathing-urban-air/558827/',
		slug: 'citylab',
	},
	{
		href: 'https://vimeo.com/269420780',
		slug: 'bbc',
	},
	{
		href:
			'https://www.circa.com/story/2018/05/03/science/an-app-tells-you-how-many-cigarettes-youre-smoking-when-you-breathe-the-polluted-air-in-your-city',
		slug: 'circa',
	},
	{
		href:
			'https://www.slate.fr/story/160929/cigarettes-equivalent-pollution-villes',
		slug: 'slate',
	},
	{
		href:
			'https://www.rtbf.be/info/medias/detail_respirer-l-air-de-bruxelles-c-est-comme-fumer-2-5-cigarettes-jour-dit-cette-appli?id=9903635',
		slug: 'rtbf',
	},
	{
		href:
			'https://www.hindustantimes.com/pune-news/planning-to-take-a-smoke-break-just-breathe-in-pune-s-air-which-equals-9-1-cigarettes-a-day/story-cAfTW4IKF2OmZ2lMgCVxFL.html',
		slug: 'hindustantimes',
	},
	{
		href: undefined,
		slug: 'nexo',
	},
	{
		href:
			'https://vitals.lifehacker.com/see-your-citys-air-pollution-measured-in-daily-cigarett-1825659774',
		slug: 'lifehacker',
	},
	{
		href: 'https://www.highsnobiety.com/p/smoking-pollution-air-app/',
		slug: 'highsnobiety',
	},
	{
		href:
			'https://www.huffingtonpost.com/entry/how-much-are-you-smoking-by-breathing-urban-air_us_5ae332e0e4b02baed1b9ccbc',
		slug: 'huffpost',
	},
	{
		href:
			'https://www.pix11.com/2018/05/09/how-much-do-you-smoke-app-translates-air-pollution-into-cigarettes-smoked/',
		slug: 'pix',
	},
	{
		href:
			'https://usbeketrica.com/article/une-appli-calcule-le-nombre-de-cigarettes-qu-on-fume-a-notre-insu-a-cause-de-la-pollution-de-l-air',
		slug: 'usbek',
	},
];

export function FeaturedSection(): React.ReactElement {
	const data = useStaticQuery(graphql`
		query FeaturedSectionQuery {
			allFile(filter: { relativeDirectory: { eq: "media" } }) {
				edges {
					node {
						childImageSharp {
							fluid {
								...GatsbyImageSharpFluid_noBase64
							}
						}
						name
					}
				}
			}
		}
	`);

	// Build a map of media slug->fluid.
	const imagesMap = data.allFile.edges.reduce(
		(
			acc: Record<string, FluidObject>,
			{
				node,
			}: {
				node: GatsbyFileNode;
			}
		) => {
			acc[node.name] = node.childImageSharp.fluid;

			return acc;
		},
		{} as Record<string, FluidObject>
	);

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
						<Img
							alt={media.slug}
							className="w-32"
							fluid={imagesMap[media.slug]}
						/>
					</a>
				))}
			</div>
		</Section>
	);
}
