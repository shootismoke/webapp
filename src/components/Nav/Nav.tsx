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
import { Link } from 'gatsby';
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
		<header className="sm:mx-8 mx-3 mt-4">
			<nav className="flex flex-row justify-between">
				{/** Should be `items-center`, but `items-end` looks better */}
				<Link
					onClick={(): void => logEvent('Nav.HomeButton.Click')}
					to="/"
				>
					<img alt="logo" className="w-32" src={logo} />
				</Link>
				{showDownloadApp && (
					<div
						className="flex items-center type-300 sm:type-400 text-orange text-right uppercase cursor-pointer"
						onClick={scrollToBottom}
					>
						Download <br className="sm:hidden" />
						the app
						<img
							alt="download"
							className="ml-2 sm:ml-4 h-6 sm:h-10"
							src={download}
						/>
					</div>
				)}
			</nav>
		</header>
	);
}
