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

import Image from 'next/image';
import React from 'react';

import box from '../../../../assets/images/conversion-box.svg';
import { Section } from '../Section';

export function AboutSection(): React.ReactElement {
	return (
		<Section title="About Sh**t! I Smoke">
			<div className="flex flex-col md:flex-row">
				<p className="md:mr-2 md:flex-1 type-100 text-gray-600">
					Publicizing pollution facts and climate change warnings
					doesn&apos;t seem to convince our communities of the
					environmental issues we face today. Scientists use obscure
					measurements, journalists cite consequences that will take
					decades to arrive... But what if we discovered that, just by
					breathing in our cities, everyone ends up
					&quot;smoking&quot; the equivalent of a pack of cigarettes
					per month?
					<br />
					<br />
					Sh**t! I Smoke is an app that translates daily air quality
					data into tangible information for the majority of the
					population. The app connects Berkeley Earth&apos;s rule of
					thumb (one cigarette per day is the rough equivalent of a
					PM2.5 level of 22 μg/m3) to open databases of Air-Quality
					Stations worldwide.
				</p>
				<div className="mt-4 md:mt-0 md:ml-2 md:flex-1 type-100 text-gray-600">
					<div className="next-images relative w-full h-32 | -mt-4 mb-6 mx-auto">
						<Image
							alt="cigarettes-conversion"
							layout="fill"
							objectFit="contain"
							src={box}
						/>
					</div>
					Use location to discover the air quality near you, or search
					on a map for stations elsewhere. Created to raise awareness
					to air pollution, the tool is free, open-source, and
					respectful of your privacy. It was able to create a
					discussion around the subject of air pollution globally,
					from TV shows in California to newspapers in China.
				</div>
			</div>
		</Section>
	);
}
