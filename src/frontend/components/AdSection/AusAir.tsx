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
import React, { useEffect, useState } from 'react';

import dreads from '../../../../assets/images/ausair/dreads-guy.webp';
import product8 from '../../../../assets/images/ausair/product-8.png';
import { logEvent } from '../../util';
import { Button } from '../Button';

export function AusAir(): React.ReactElement {
	const [size, setSize] = useState({
		x: typeof window !== 'undefined' ? window.innerWidth : 0,
	});

	useEffect(() => {
		setSize({ x: window.innerWidth });
		window.onresize = () =>
			setSize({
				x: window.innerWidth,
			});
	}, []);

	return (
		<div
			className="border border-gray-200 rounded-xl shadow-md overflow-hidden
				h-64
				md:grid md:grid-cols-3"
		>
			<div className="overflow-hidden h-32 md:h-64 md:col-span-2">
				<div className="next-images relative w-full h-full">
					<Image
						alt="cigarettes-conversion"
						className="transform scale-125 sm:scale-100 lg:scale-150"
						layout="fill"
						objectFit={
							size.x > 768 && size.x <= 1024 ? 'none' : 'cover'
						}
						objectPosition={
							size.x > 1024 ? 'center -500%' : 'center top'
						}
						src={dreads}
					/>
				</div>
			</div>
			<div className="px-6 py-4 flex flex-col justify-between items-center md:items-start">
				<div className="hidden md:block next-images relative w-32 h-24">
					<Image
						alt="cigarettes-conversion"
						layout="fill"
						objectFit="cover"
						objectPosition="left"
						src={product8}
					/>
				</div>

				<div className="text-center md:text-left">
					<h3 className="type-200">AirFlex Filtration Mask Pack</h3>
					<p className="mt-1 md:mt-2 type-100 text-gray-600">
						All days comformt meets &gt;99%{' '}
						<br className="hidden lg:block" />
						filtration.
					</p>
				</div>

				<a
					href="https://shopausair.com/?ref=shootismoke"
					onClick={() => {
						logEvent('AdSection.AusAir.v1DreadsGuy.Click', {
							screenSize: size.x,
						});
					}}
					rel="noreferrer"
					target="_blank"
				>
					<Button className="mt-2 px-10 md:px-6 py-2 text-center">
						<div className="leading-4 type-300 text-orange uppercase">
							<span className="inline md:hidden lg:inline">
								Save{' '}
							</span>
							10% with code
						</div>
						<div className="leading-4 type-300 text-orange uppercase">
							&apos;STOPSMOKING&apos;
						</div>
					</Button>
				</a>
			</div>
		</div>
	);
}
