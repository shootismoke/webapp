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

import apple from '../../../assets/images/app-store@3x.png';
import play from '../../../assets/images/play-store@3x.png';
import { Section } from '../Section';
import { SectionDivider } from '../SectionDivider';

export function DownloadSection(): React.ReactElement {
	return (
		<div className="pt-4 pb-8" id="download">
			<SectionDivider title="App available on" />
			<Section className="lg:py-4">
				<h4 className="sm:mb-4 tracking-wider font-extrabold sm:text-xl text-center">
					<span className="text-orange">Set notifications</span> on
					your phone
					<br />
					and <span className="text-orange">share results</span> with
					friends:
				</h4>
				<div className="mt-3 flex flex-row justify-center">
					<a
						className="mx-2 w-64"
						href="https://itunes.apple.com/us/app/s-i-smoke/id1365605567?mt=8"
						rel="noreferrer"
						target="_blank"
					>
						<img alt="download on Apple Store" src={apple} />
					</a>
					<a
						className="mx-2 w-64"
						href="https://play.google.com/store/apps/details?id=com.shitismoke.app"
						rel="noreferrer"
						target="_blank"
					>
						<img alt="download on Play Store" src={play} />
					</a>
				</div>
			</Section>
		</div>
	);
}
