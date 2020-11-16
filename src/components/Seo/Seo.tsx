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

import favicon from '@shootismoke/ui/assets/logos/AppIcons/Assets.xcassets/AppIcon.appiconset/64.png';
import React from 'react';
import { Helmet } from 'react-helmet';

interface SeoProps {
	description?: string;
	pathname: string;
	title: string;
}

/**
 * @see https://web.dev/html-has-lang.
 */
const HTML_ATTRIBUTES = { lang: 'en' };

export function Seo(props: SeoProps): React.ReactElement {
	const { description, pathname, title } = props;

	return (
		<Helmet htmlAttributes={HTML_ATTRIBUTES}>
			<meta charSet="utf-8" />
			<meta
				name="description"
				content={`${
					description || ''
				}Sh**t! I Smoke is an app that translates daily air quality data into equivalent in cigarettes smoked. The app uses Berkeley Earth's conversion formula with open databases of Air-Quality Stations worldwide.`}
			/>

			<link rel="preconnect" href="https://api.bigdatacloud.net" />
			<link rel="preconnect" href="https://api.waqi.info" />
			<link rel="preconnect" href="https://api.openaq.org" />

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
		</Helmet>
	);
}
