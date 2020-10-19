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

import React, { useRef } from 'react';

import pageLeft from '../../../assets/images/icons/pagination_left.svg';
import pageRight from '../../../assets/images/icons/pagination_right.svg';

interface CarouselProps {
	children: React.ReactElement[];
}

/**
 * Offset to scroll by, when we click on the pagination buttons.
 */
const SCROLL_BY = 256;

export function Carousel(props: CarouselProps): React.ReactElement {
	const { children } = props;
	const scrollDiv = useRef<HTMLDivElement>(null);

	function scrollLeft(): void {
		if (!scrollDiv.current) {
			return;
		}
		scrollDiv.current.scrollLeft -= SCROLL_BY;
	}
	function scrollRight(): void {
		if (!scrollDiv.current) {
			return;
		}
		scrollDiv.current.scrollLeft += SCROLL_BY;
	}

	return (
		<div className="relative flex items-center">
			<img
				alt="page-left"
				className="hidden sm:block absolute -left-6 cursor-pointer"
				onClick={scrollLeft}
				src={pageLeft}
			/>
			<img
				alt="page-right"
				className="hidden sm:block absolute -right-6 cursor-pointer"
				onClick={scrollRight}
				src={pageRight}
			/>
			<div
				className="w-full h-68 sm:h-78 overflow-x-auto scroll-smooth flex flex-row"
				ref={scrollDiv}
			>
				{children}
			</div>
		</div>
	);
}
