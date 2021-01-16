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

import appStore from '../../../../assets/images/app-store.png';
import playStore from '../../../../assets/images/play-store.png';
import { logEvent } from '../../util';
import { Section } from '../Section';

export function DownloadSection(): React.ReactElement {
	return (
		<Section id="download" title="App available on">
			<div className="flex flex-col md:flex-row md:items-center">
				<h3
					className="text-center type-400
					md:text-left md:mr-24 md:type-600"
				>
					<>
						<span className="text-orange">Set notifications</span>{' '}
						on your phone <br className="md:hidden" />
						&amp; <span className="text-orange">
							share results
						</span>{' '}
						with friends:
					</>
				</h3>
				<div className="mt-4 md:mt-0 flex md:flex-col justify-center">
					<a
						className="mr-4 md:mb-4 w-56"
						href="https://play.google.com/store/apps/details?id=com.shitismoke.app"
						onClick={(): void =>
							logEvent('DownloadSection.Android.Click')
						}
						rel="noreferrer"
						target="_blank"
					>
						<div className="next-images relative h-16 | rounded-2xl">
							<Image
								alt="download on Play Store"
								layout="fill"
								objectFit="contain"
								src={playStore}
							/>
						</div>
					</a>
					<a
						className="w-56"
						href="https://itunes.apple.com/us/app/s-i-smoke/id1365605567?mt=8"
						onClick={(): void =>
							logEvent('DownloadSection.Ios.Click')
						}
						rel="noreferrer"
						target="_blank"
					>
						<div className="next-images relative h-16 | rounded-2xl">
							<Image
								alt="download on Apple Store"
								layout="fill"
								objectFit="contain"
								src={appStore}
							/>
						</div>
					</a>
				</div>
			</div>
		</Section>
	);
}
