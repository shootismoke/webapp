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

import favicon from '@shootismoke/ui/assets/logos/AppIcons/Assets.xcassets/AppIcon.appiconset/64.png';
import Head from 'next/head';
import React from 'react';

interface SeoProps {
	description?: string;
	pathname: string;
	title: string;
}

export function Seo(props: SeoProps): React.ReactElement {
	const { description, pathname, title } = props;

	return (
		<Head>
			<meta charSet="utf-8" />
			<meta
				name="description"
				content={`${
					description || ''
				}Sh**t! I Smoke is an app that translates daily air quality data into equivalent in cigarettes smoked. The app uses Berkeley Earth's conversion formula with open databases of Air-Quality Stations worldwide.`}
			/>

			<link
				rel="preconnect"
				href="https://fonts.gstatic.com"
				crossOrigin="anonymous"
			/>
			<link
				rel="preconnect"
				href="https://api.bigdatacloud.net"
				crossOrigin="anonymous"
			/>
			<link
				rel="preconnect"
				href="https://api.waqi.info"
				crossOrigin="anonymous"
			/>
			<link
				rel="preconnect"
				href="https://api.openaq.org"
				crossOrigin="anonymous"
			/>
			<link
				rel="preconnect"
				href="https://api.ipdata.co"
				crossOrigin="anonymous"
			/>

			<link
				rel="stylesheet"
				href="https://fonts.googleapis.com/css?family=Montserrat:500,800&display=swap"
			/>

			<link rel="icon" href={favicon} />

			<link
				rel="canonical"
				href={`https://shootismoke.app${pathname.replace(/\/$/, '')}`}
			/>

			<title>{title} - Sh**t! I Smoke</title>

			<script
				async
				defer
				src="https://scripts.withcabin.com/hello.js"
			></script>
		</Head>
	);
}
