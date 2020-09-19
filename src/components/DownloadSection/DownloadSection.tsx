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

import apple from '../../../assets/images/app-store@3x.png';
import play from '../../../assets/images/play-store@3x.png';
import { Section } from '../Section';
import { SectionDivider } from '../SectionDivider';

export function DownloadSection(): React.ReactElement {
	return (
		<>
			<SectionDivider title="App available on" />
			<Section className="xl:py-6 lg:py-6">
				<div className="flex flex-row justify-center">
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
		</>
	);
}
