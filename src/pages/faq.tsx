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
import Link from 'next/link';
import React, { useEffect } from 'react';

import box from '../../assets/images/conversion-box.svg';
import backArrow from '../../assets/images/icons/back_arrow.svg';
import { Footer, H1, Nav, Section, Seo } from '../frontend/components';
import { t } from '../frontend/localization';
import { logEvent } from '../frontend/util';

interface FaqSectionProps extends React.HTMLProps<HTMLDivElement> {
	children: React.ReactElement;
	title: string;
}

function FaqSection(props: FaqSectionProps): React.ReactElement {
	const { children, title, ...rest } = props;

	return (
		<Section {...rest}>
			<h2 className="md:pt-3 type-500">{title}</h2>
			<p className="mt-5 type-100 text-gray-600">{children}</p>
		</Section>
	);
}

export default function Faq(): React.ReactElement {
	useEffect(() => logEvent('Page.Faq.View'), []);

	return (
		<>
			<Seo pathname="/faq" title="Frequently Asked Questions" />
			<Nav showDownloadApp={false} />

			<Section className="pt-3">
				<Link href="/">
					<a className="flex items-center type-300 text-orange uppercase">
						<span className="next-images relative w-3 h-3 | mr-3">
							<Image
								alt="back"
								layout="fill"
								objectFit="contain"
								src={backArrow}
							/>
						</span>

						<span>Back to Homepage</span>
					</a>
				</Link>
				<H1 className="pt-3 text-orange">Frequently Asked Questions</H1>
			</Section>

			<FaqSection
				title={t(
					'about_how_do_you_calculate_the_number_of_cigarettes_title'
				)}
			>
				<>
					<span>
						{t(
							'about_how_do_you_calculate_the_number_of_cigarettes_message_1'
						)}
						<a
							className="text-orange hover:underline"
							href="https://berkeleyearth.org/air-pollution-and-cigarette-equivalence/"
							rel="noreferrer"
							target="_blank"
						>
							{t(
								'about_how_do_you_calculate_the_number_of_cigarettes_link_1'
							)}
						</a>
						{t(
							'about_how_do_you_calculate_the_number_of_cigarettes_message_2'
						)}{' '}
						&micro;g/m&sup3;{' \u207D'}&sup1;{'\u207E'}.
					</span>

					<div className="next-images | mb-3">
						<Image
							alt="conversion-box"
							height={124}
							src={box}
							width={390}
						/>
					</div>

					<a
						className="type-100 hover:underline"
						href="https://berkeleyearth.org/air-pollution-and-cigarette-equivalence/"
						rel="noreferrer"
						target="_blank"
					>
						(1){' '}
						https://berkeleyearth.org/air-pollution-and-cigarette-equivalence/
					</a>
				</>
			</FaqSection>

			<FaqSection title={t('about_beta_inaccurate_title')}>
				<>{t('about_beta_inaccurate_message')}</>
			</FaqSection>

			<FaqSection title={t('about_where_does_data_come_from_title')}>
				<>
					{t('about_where_does_data_come_from_message_1')}
					<a
						className="text-orange hover:underline"
						href="https://aqicn.org"
						rel="noreferrer"
						target="_blank"
					>
						{t('about_where_does_data_come_from_link_1')}
					</a>
					{t('about_where_does_data_come_from_message_2')}
					<a
						className="text-orange hover:underline"
						href="https://openaq.org"
						rel="noreferrer"
						target="_blank"
					>
						{t('about_where_does_data_come_from_link_2')}
					</a>
					{t('about_where_does_data_come_from_message_3')}
				</>
			</FaqSection>

			<FaqSection
				id="station-so-far"
				title={t('about_why_is_the_station_so_far_title')}
			>
				<>{t('about_why_is_the_station_so_far_message')}</>
			</FaqSection>

			<FaqSection title={t('about_weird_results_title')}>
				<>
					{t('about_weird_results_message_1')}
					<a
						className="text-orange hover:underline"
						href="https://aqicn.org"
						rel="noreferrer"
						target="_blank"
					>
						{t('about_weird_results_link_1')}
					</a>
					{t('about_weird_results_message_2')}
					<a
						className="text-orange hover:underline"
						href="https://openaq.org"
						rel="noreferrer"
						target="_blank"
					>
						{t('about_weird_results_link_2')}
					</a>
					{t('about_weird_results_message_3')}
				</>
			</FaqSection>

			<Footer />
		</>
	);
}
