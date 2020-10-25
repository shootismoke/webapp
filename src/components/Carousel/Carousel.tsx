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

import c from 'classnames';
import React, { useRef } from 'react';

import pageLeft from '../../../assets/images/icons/pagination_left.svg';
import pageRight from '../../../assets/images/icons/pagination_right.svg';

export * from './CarouselCard';

interface CarouselProps extends React.HTMLProps<HTMLDivElement> {
	innerClassName?: string;
	onPageLeftClick?: () => void;
	onPageRightClick?: () => void;
}

/**
 * Offset to scroll by, when we click on the pagination buttons.
 */
const SCROLL_BY = 256;

export function Carousel(props: CarouselProps): React.ReactElement {
	const {
		children,
		className,
		innerClassName,
		onPageLeftClick,
		onPageRightClick,
		...rest
	} = props;
	const scrollDiv = useRef<HTMLDivElement>(null);

	function scrollLeft(): void {
		onPageLeftClick && onPageLeftClick();
		if (!scrollDiv.current) {
			return;
		}
		scrollDiv.current.scrollLeft -= SCROLL_BY;
	}
	function scrollRight(): void {
		onPageRightClick && onPageRightClick();
		if (!scrollDiv.current) {
			return;
		}
		scrollDiv.current.scrollLeft += SCROLL_BY;
	}

	return (
		<div className={c('relative flex items-center', className)} {...rest}>
			<img
				alt="page-left"
				className="hidden md:block absolute -left-6 cursor-pointer z-10"
				onClick={scrollLeft}
				src={pageLeft}
			/>
			<img
				alt="page-right"
				className="hidden md:block absolute -right-6 cursor-pointer z-10"
				onClick={scrollRight}
				src={pageRight}
			/>
			<div
				className={c(
					'overflow-x-auto scroll-smooth flex flex-row',
					innerClassName
				)}
				ref={scrollDiv}
			>
				{children}
			</div>
		</div>
	);
}
