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

import sadFace from '@shootismoke/ui/assets/images/error@3x.png';
import Image from 'next/image';
import React from 'react';

import { H1 } from '../H1';
import { HeroLayout } from '../HeroLayout';

interface SadFaceProps {
	className?: string;
	message?: string;
}

export function SadFace(props: SadFaceProps): React.ReactElement {
	const { className, message } = props;

	return (
		<div className={className}>
			<HeroLayout
				cover={
					<div className="next-images relative | h-full">
						<Image
							alt="error"
							layout="fill"
							objectFit="contain"
							objectPosition="left"
							src={sadFace}
						/>
					</div>
				}
				title={
					<H1>
						<>
							Cannot load<br></br>
							<span className="text-orange">your cigarettes</span>
						</>
					</H1>
				}
			/>

			<p className="mt-4 type-100 text-gray-600">
				{message} Please try to search for another city.
			</p>
		</div>
	);
}
