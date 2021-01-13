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

import c from 'classnames';
import React from 'react';

import blogfolha from '../../../assets/images/blogs/blogfolha.jpg?lqip';
import bloomberg from '../../../assets/images/blogs/bloomberg.jpg?lqip';
import france3Regions from '../../../assets/images/blogs/france3_regions.jpg?lqip';
import highsnobiety from '../../../assets/images/blogs/highsnobiety.jpg?lqip';
import hindustantimes from '../../../assets/images/blogs/hindustantimes.jpg?lqip';
import hln from '../../../assets/images/blogs/hln.webp';
import huffpostKorea from '../../../assets/images/blogs/huffpost_korea.jpeg?lqip';
import lifehacker from '../../../assets/images/blogs/lifehacker.webp';
import okdiario from '../../../assets/images/blogs/okdiario.jpg?lqip';
import pix11 from '../../../assets/images/blogs/pix11.jpg?lqip';
import rppNoticias from '../../../assets/images/blogs/rpp-noticias.jpg?lqip';
import sfgate from '../../../assets/images/blogs/sfgate.jpg?lqip';
import slate from '../../../assets/images/blogs/slate.jpg?lqip';
import tencentqq from '../../../assets/images/blogs/tencentqq.webp';
import thedailybeast from '../../../assets/images/blogs/thedailybeast.webp';
import usbeketrica from '../../../assets/images/blogs/usbeketrica.jpg?lqip';
import webmd from '../../../assets/images/blogs/webmd.jpg?lqip';
import { logEvent } from '../../util';
import { Carousel, CarouselCard } from '../Carousel';
import { Section } from '../Section';

interface Blog {
	image: string;
	slug: string;
	subtitle: string;
	title: string;
	link: string;
}

const blogs: Blog[] = [
	{
		image: bloomberg,
		title: "How Much Are You 'Smoking' by Breathing Urban Air?",
		subtitle: 'Bloomberg',
		link:
			'https://www.bloomberg.com/news/articles/2018-04-25/the-app-that-translates-air-pollution-into-cigarettes',
		slug: 'bloomberg',
	},
	{
		image: lifehacker,
		title: "See Your City's Air Pollution Measured in Daily Cigarettes",
		subtitle: 'Lifehacker',
		link:
			'https://vitals.lifehacker.com/see-your-citys-air-pollution-measured-in-daily-cigarett-1825659774',
		slug: 'lifehacker',
	},
	{
		image: huffpostKorea,
		title: '도시 공기 호흡은 어느 정도의 흡연에 해당할까?',
		subtitle: 'Huffpost Korea',
		link:
			'https://www.huffingtonpost.kr/entry/story_kr_5ae96fe8e4b06748dc8dad0b?utm_hp_ref=kr-homepage',
		slug: 'huffpost_korea',
	},
	{
		image: france3Regions,
		title:
			"Pollution de l'air : comme si vous aviez fumé 2 cigarettes à Toulouse aujourd'hui !",
		subtitle: 'FranceInfo',
		link:
			'https://france3-regions.francetvinfo.fr/occitanie/haute-garonne/toulouse/pollution-air-si-vous-aviez-fume-2-cigarettes-toulouse-aujourd-hui-1468885.html',
		slug: 'france3Regions',
	},
	{
		image: usbeketrica,
		title:
			'Une appli calcule le nombre de cigarettes qu’on fume à notre insu à cause de la pollution de l’air',
		subtitle: 'Usbek & Rica',
		link:
			'https://usbeketrica.com/fr/article/une-appli-calcule-le-nombre-de-cigarettes-qu-on-fume-a-notre-insu-a-cause-de-la-pollution-de-l-air',
		slug: 'usbeketrica',
	},
	{
		image: hindustantimes,
		title:
			'Breathing Mumbai’s air as bad as puffing 4 cigarettes a day, Delhi worse at 7.7',
		subtitle: 'Hindustan Times',
		link:
			'https://www.hindustantimes.com/mumbai-news/breathing-mumbai-s-air-as-bad-as-puffing-4-cigarettes-a-day-delhi-worse-at-7-7/story-xzf9NzgePRfP2A7C4ousmM.html',
		slug: 'hindustantimes',
	},
	{
		image: highsnobiety,
		title:
			'This app tells you how many cigarettes you "smoke" by breathing urban air',
		subtitle: 'Highsnobiety',
		link: 'https://www.highsnobiety.com/p/smoking-pollution-air-app/',
		slug: 'highsnobiety',
	},
	{
		image: pix11,
		title:
			'How much do you ‘smoke’? App translates air pollution into cigarettes smoked',
		subtitle: 'Pix11 New York',
		link:
			'https://www.pix11.com/2018/05/09/how-much-do-you-smoke-app-translates-air-pollution-into-cigarettes-smoked/',
		slug: 'pix11',
	},
	{
		image: thedailybeast,
		title: 'The Air Is So Bad in These Cities, You May as Well Be Smoking',
		subtitle: 'Daily Beast',
		link:
			'https://www.thedailybeast.com/the-air-is-so-bad-in-these-cities-you-may-as-well-be-smoking',
		slug: 'thedailybeast',
	},
	{
		image: blogfolha,
		title:
			'App soma quantos cigarros cada pessoa ‘fuma’ só por respirar em áreas poluídas',
		subtitle: 'Folha de São Paulo',
		link:
			'https://avenidas.blogfolha.uol.com.br/2018/07/04/app-mostra-quantos-cigarros-cada-pessoa-fuma-por-viver-em-cidade-poluida/',
		slug: 'blogfolha',
	},
	{
		image: hln,
		title: "App vertelt hoeveel sigaretten je 'rookt' door luchtvervuiling",
		subtitle: 'HLN.be',
		link:
			'https://www.hln.be/de-krant/app-vertelt-hoeveel-sigaretten-je-rookt-door-luchtvervuiling~a1a421d0/',
		slug: 'hln',
	},
	{
		image: tencentqq,
		title: '呼吸成了新型的吸烟？',
		subtitle: 'Tencent QQ',
		link: 'https://new.qq.com/omn/20180710/20180710A1S9BA.html',
		slug: 'tencentqq',
	},
	{
		image: webmd,
		title: 'Air Pollution Kills as Many People as Cigarettes',
		subtitle: 'WebMD',
		link:
			'https://www.webmd.com/lung/news/20191008/air-pollution-kills-as-many-people-as-cigarettes',
		slug: 'webmd',
	},
	{
		image: sfgate,
		title:
			"Here's why researchers say breathing San Francisco air today is like smoking 11 cigarettes",
		subtitle: 'San Francisco Gate',
		link:
			'https://www.sfgate.com/california-wildfires/article/air-cigarettes-smoke-breathing-aqi-unhealthy-13399240.php',
		slug: 'sfgate',
	},
	{
		image: rppNoticias,
		title:
			'Descubre cuántos cigarrillos fumas al día por la contaminación del lugar donde vives',
		subtitle: 'RPP Peru',
		link:
			'https://rpp.pe/tecnologia/apps/descubre-cuantos-cigarrillos-fumas-al-dia-por-la-contaminacion-del-lugar-donde-vives-noticia-1119721?ref=rpp',
		slug: 'rpp-noticias',
	},
	{
		image: slate,
		title:
			"L'équivalent de combien de cigarettes fumez-vous en respirant l'air des villes?",
		subtitle: 'Slate',
		link:
			'https://www.slate.fr/story/160929/cigarettes-equivalent-pollution-villes',
		slug: 'slate',
	},
	{
		image: okdiario,
		title:
			'Shit! I Smoke, la aplicación que te dice cuantos cigarrillos te fumas con solo salir a la calle',
		subtitle: 'Ok Diario',
		link:
			'https://okdiario.com/curiosidades/shit-i-smoke-app-cigarrillos-contaminacion-2185319',
		slug: 'okdiario',
	},
];

export function BlogSection(): React.ReactElement {
	return (
		<Section
			className="md:px-24"
			noPadding={true}
			title="Latest Stories"
			titleClassName="px-6 md:px-0"
		>
			<Carousel
				onPageLeftClick={(): void =>
					logEvent('BlogSection.PageLeft.Click')
				}
				onPageRightClick={(): void =>
					logEvent('BlogSection.PageRight.Click')
				}
			>
				{blogs.map((blog, blogIndex) => (
					<a
						href={blog.link}
						key={blog.title}
						onClick={(): void =>
							logEvent('BlogSection.Blog.Click', {
								blogIndex,
								blogUrl: blog.link,
								blogTitle: blog.title,
							})
						}
						rel="noreferrer"
						target="_blank"
					>
						<CarouselCard
							className={c(blogIndex === 0 && 'ml-3 md:ml-0')}
						>
							<img
								alt={blog.title}
								className="w-full h-40 md:h-50 object-cover"
								src={blog.image}
							/>
							<div className="mt-2 px-4">
								<h3 className="type-200 line-clamp-2">
									{blog.title}
								</h3>

								<p className="mt-1 type-100 text-gray-600">
									{blog.subtitle}
								</p>
							</div>
						</CarouselCard>
					</a>
				))}
			</Carousel>
		</Section>
	);
}
