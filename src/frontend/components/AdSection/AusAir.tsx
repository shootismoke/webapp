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

import { Button } from '../Button';

export function AusAir(): React.ReactElement {
	return (
		<div className="rounded grid grid-cols-3 h-64">
			<div className="col-span-2">
				<div className="next-images relative w-full h-full">
					<Image
						alt="cigarettes-conversion"
						layout="fill"
						objectFit="contain"
						src="/images/ausair/black-man-white-mask.webp"
					/>
				</div>
			</div>
			<div className="px-6 py-4">
				<div className="next-images relative w-full h-20">
					<Image
						alt="cigarettes-conversion"
						layout="fill"
						objectFit="contain"
						src="/images/ausair/product-8.png"
					/>
				</div>
				<h3 className="type-200">AirFlex Filtration Mask Pack</h3>
				<p className="mt-2 type-100">
					All days comform meets &gt;99% filtration.
				</p>
				<Button className="mt-2 px-3 py-1 text-center">
					<span className="leading-4 type-300 text-orange uppercase">
						Save 10% with code &apos;STOPSMOKING&apos;
					</span>
				</Button>
			</div>
		</div>
	);
}
