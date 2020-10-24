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

import fallbackImage from '../../../assets/images/blogs/blog@3x.png';
import { logEvent } from '../../util';
import { Card } from '../Card';
import { Carousel } from '../Carousel';
import { Section } from '../Section';

interface Blog {
	image: string;
	subtitle: string;
	title: string;
	link: string;
}

const blogs: Blog[] = [
	{
		title: "How Much Are You 'Smoking' by Breathing Urban Air?",
		subtitle: 'Bloomberg',
		link:
			'https://www.bloomberg.com/news/articles/2018-04-25/the-app-that-translates-air-pollution-into-cigarettes',
		image:
			'https://assets.bwbx.io/images/users/iqjWHBFdfxIU/ifwpAECKJaO0/v0/1800x-1.jpg',
	},
	{
		title: "See Your City's Air Pollution Measured in Daily Cigarettes",
		subtitle: 'Lifehacker',
		link:
			'https://vitals.lifehacker.com/see-your-citys-air-pollution-measured-in-daily-cigarett-1825659774',
		image:
			'https://i.kinja-img.com/gawker-media/image/upload/c_scale,f_auto,fl_progressive,pg_1,q_80,w_1600/say89z0ok9b1gsyjmqic.jpg',
	},
	{
		title: '도시 공기 호흡은 어느 정도의 흡연에 해당할까?',
		subtitle: 'Huffpost Korea',
		link:
			'https://www.huffingtonpost.kr/entry/story_kr_5ae96fe8e4b06748dc8dad0b?utm_hp_ref=kr-homepage',
		image:
			'https://img.huffingtonpost.com/asset/5ae971a61e00002c008e42d8.jpeg?ops=scalefit_720_noupscale&format=webp',
	},
	{
		title:
			"Pollution de l'air : comme si vous aviez fumé 2 cigarettes à Toulouse aujourd'hui !",
		subtitle: 'FranceInfo',
		link:
			'https://france3-regions.francetvinfo.fr/occitanie/haute-garonne/toulouse/pollution-air-si-vous-aviez-fume-2-cigarettes-toulouse-aujourd-hui-1468885.html',
		image:
			'https://france3-regions.francetvinfo.fr/image/zAz0ADuAwjgfYiMgK0DWeY5RXtw/930x620/regions/2020/06/09/5edf557b42882_ftv_0138-00_00_01_05-3530003.jpg',
	},
	{
		title:
			'Une appli calcule le nombre de cigarettes qu’on fume à notre insu à cause de la pollution de l’air',
		subtitle: 'Usbek & Rica',
		link:
			'https://usbeketrica.com/fr/article/une-appli-calcule-le-nombre-de-cigarettes-qu-on-fume-a-notre-insu-a-cause-de-la-pollution-de-l-air',
		image:
			'https://usbeketrica.com/media/4349/download/5aeb172965cab.jpg?v=1&inline=1',
	},
	{
		title:
			'Breathing Mumbai’s air as bad as puffing 4 cigarettes a day, Delhi worse at 7.7',
		subtitle: 'Hindustan Times',
		link:
			'https://www.hindustantimes.com/mumbai-news/breathing-mumbai-s-air-as-bad-as-puffing-4-cigarettes-a-day-delhi-worse-at-7-7/story-xzf9NzgePRfP2A7C4ousmM.html',
		image:
			'https://www.hindustantimes.com/rf/image_size_960x540/HT/p2/2018/05/28/Pictures/weather_e209a22a-61e7-11e8-8da7-089610bcbead.jpg',
	},
	{
		title:
			'This app tells you how many cigarettes you "smoke" by breathing urban air',
		subtitle: 'Highsnobiety',
		link: 'https://www.highsnobiety.com/p/smoking-pollution-air-app/',
		image:
			'https://static.highsnobiety.com/thumbor/R5hWeHxTvPS3c27motCCpb4Us2I=/1600x1067/static.highsnobiety.com/wp-content/uploads/2018/05/03124912/smoking-pollution-air-app-01.jpg',
	},
	{
		title:
			'How much do you ‘smoke’? App translates air pollution into cigarettes smoked',
		subtitle: 'Pix11 New York',
		link:
			'https://www.pix11.com/2018/05/09/how-much-do-you-smoke-app-translates-air-pollution-into-cigarettes-smoked/',
		image: fallbackImage,
	},
	{
		title: 'The Air Is So Bad in These Cities, You May as Well Be Smoking',
		subtitle: 'Daily Beast',
		link:
			'https://www.thedailybeast.com/the-air-is-so-bad-in-these-cities-you-may-as-well-be-smoking',
		image:
			'https://img.thedailybeast.com/image/upload/c_crop,d_placeholder_euli9k,h_1440,w_2560,x_0,y_0/dpr_1.5/c_limit,w_1044/fl_lossy,q_auto/v1530028323/180626-biba-smoke-app-tease_a0lxbo',
	},
	{
		title:
			'App soma quantos cigarros cada pessoa ‘fuma’ só por respirar em áreas poluídas',
		subtitle: 'Folha de São Paulo',
		link:
			'https://avenidas.blogfolha.uol.com.br/2018/07/04/app-mostra-quantos-cigarros-cada-pessoa-fuma-por-viver-em-cidade-poluida/',
		image:
			'https://avenidas.blogfolha.uol.com.br/files/2018/07/Vista-do-edif%C3%ADcio-It%C3%A1lia-em-dia-de-tempo-seco-umidade-continuar%C3%A1-baixa-no-in%C3%ADcio-da-primavera-Giovanni-Bello-25.jul_.17-Folhapress-768x511.jpg',
	},
	{
		title: "App vertelt hoeveel sigaretten je 'rookt' door luchtvervuiling",
		subtitle: 'HLN.be',
		link:
			'https://www.hln.be/de-krant/app-vertelt-hoeveel-sigaretten-je-rookt-door-luchtvervuiling~a1a421d0/',
		image:
			'https://images4.persgroep.net/rcs/Rz_snwcx399aQWmg2fMWWDttlek/diocontent/123007508/_crop/1056/0/1086/1891/_fitwidth/694/?appId=21791a8992982cd8da851550a453bd7f&quality=0.8&desiredformat=webp',
	},
	{
		title: '呼吸成了新型的吸烟？',
		subtitle: 'Tencent QQ',
		link: 'https://new.qq.com/omn/20180710/20180710A1S9BA.html',
		image: 'https://inews.gtimg.com/newsapp_match/0/4321785845/0',
	},
	{
		title: 'Air Pollution Kills as Many People as Cigarettes',
		subtitle: 'WebMD',
		link:
			'https://www.webmd.com/lung/news/20191008/air-pollution-kills-as-many-people-as-cigarettes',
		image:
			'https://img.webmd.com/dtmcms/live/webmd/consumer_assets/site_images/article_thumbnails/news/2019/10_2019/pollution_smog/1800x1200_pollution_smog.jpg?resize=*:350px',
	},
	{
		title:
			"Here's why researchers say breathing San Francisco air today is like smoking 11 cigarettes",
		subtitle: 'San Francisco Gate',
		link:
			'https://www.sfgate.com/california-wildfires/article/air-cigarettes-smoke-breathing-aqi-unhealthy-13399240.php',
		image: 'https://s.hdnux.com/photos/77/00/01/16515154/3/1200x0.jpg',
	},
	{
		title:
			'Descubre cuántos cigarrillos fumas al día por la contaminación del lugar donde vives',
		subtitle: 'RPP Peru',
		link:
			'https://rpp.pe/tecnologia/apps/descubre-cuantos-cigarrillos-fumas-al-dia-por-la-contaminacion-del-lugar-donde-vives-noticia-1119721?ref=rpp',
		image: 'https://e.rpp-noticias.io/normal/2018/04/30/341334_602163.jpg',
	},
	{
		title:
			"L'équivalent de combien de cigarettes fumez-vous en respirant l'air des villes?",
		subtitle: 'Slate',
		link:
			'http://www.slate.fr/story/160929/cigarettes-equivalent-pollution-villes',
		image:
			'http://www.slate.fr/sites/default/files/styles/1060x523/public/000_mn2r4.jpg',
	},
	{
		title:
			'Shit! I Smoke, la aplicación que te dice cuantos cigarrillos te fumas con solo salir a la calle',
		subtitle: 'Ok Diario',
		link:
			'https://okdiario.com/curiosidades/shit-i-smoke-app-cigarrillos-contaminacion-2185319',
		image:
			'https://okdiario.com/img/2018/04/26/la-app-que-te-dice-cuantos-cigarrillos-te-fumas-con-solo-salir-a-la-calle-1-655x368.jpg',
	},
];

export function BlogSection(): React.ReactElement {
	return (
		<Section
			className="pl-6 md:px-24"
			noPadding={true}
			title="Latest Stories"
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
					<Card
						className="
							mr-3 w-40 h-64
							md:mr-5 md:w-48 md:h-74
							flex-shrink-0"
						key={blog.title}
					>
						<img
							alt={blog.title}
							className="h-42 md:h-52 object-cover"
							src={blog.image}
						/>
						<div className="px-4">
							<a
								href={blog.link}
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
								<h4
									className="
									mt-4 type-200 line-clamp-2
									hover:underline"
								>
									{blog.title}
								</h4>
							</a>
							<p className="mt-1 type-100 text-gray-600">
								{blog.subtitle}
							</p>
						</div>
					</Card>
				))}
			</Carousel>
		</Section>
	);
}
