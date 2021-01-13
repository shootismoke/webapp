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

import logo from '@shootismoke/ui/assets/logos/logo_text_2lines.svg';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import download from '../../../assets/images/icons/download.svg';
import { logEvent } from '../../util';

/**
 * Scroll to the bottom of the page.
 * @see https://stackoverflow.com/questions/11715646/scroll-automatically-to-the-bottom-of-the-page/29971996
 */
function scrollToBottom(): void {
	logEvent('Nav.DownloadApp.Click');
	window.scrollTo(0, document.body.scrollHeight);
}

interface NavProps {
	showDownloadApp?: boolean;
}

export function Nav(props: NavProps): React.ReactElement {
	const { showDownloadApp = true } = props;

	return (
		<header className="mt-3 md:mt-9 mx-3 md:mx-9">
			<nav className="flex flex-row justify-between">
				<Link href="/">
					<a>
						<div className="next-images relative w-40 | h-10 md:h-12">
							<Image
								alt="logo"
								layout="fill"
								objectFit="contain"
								objectPosition="left"
								onClick={(): void =>
									logEvent('Nav.HomeButton.Click')
								}
								src={logo}
							/>
						</div>
					</a>
				</Link>
				{showDownloadApp && (
					<div
						className="flex items-center type-300 md:type-400 text-orange text-right uppercase md:normal-case cursor-pointer"
						onClick={scrollToBottom}
					>
						Download <br className="md:hidden" />
						the app
						<div className="next-images relative w-8 | ml-2 md:ml-4 h-6 md:h-10">
							<Image
								alt="download"
								layout="fill"
								objectFit="contain"
								objectPosition="right"
								src={download}
							/>
						</div>
					</div>
				)}
			</nav>
		</header>
	);
}
