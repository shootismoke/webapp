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
import React from 'react';

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
								src="/images/play-store.png"
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
								src="/images/app-store.png"
							/>
						</div>
					</a>
				</div>
			</div>
		</Section>
	);
}
