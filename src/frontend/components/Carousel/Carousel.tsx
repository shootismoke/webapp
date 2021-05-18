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

import c from 'classnames';
import Image from 'next/image';
import React, { useRef } from 'react';

import pageLeft from '../../../../assets/images/icons/pagination-left.svg';
import pageRight from '../../../../assets/images/icons/pagination-right.svg';

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
			<div className="next-images w-12 h-12 | hidden md:block absolute -left-6 cursor-pointer z-10">
				<Image
					alt="page-left"
					layout="fill"
					objectFit="contain"
					onClick={scrollLeft}
					src={pageLeft}
				/>
			</div>

			<div className="next-images w-12 h-12 | hidden md:block absolute -right-6 cursor-pointer z-10">
				<Image
					alt="page-right"
					layout="fill"
					objectFit="contain"
					onClick={scrollRight}
					src={pageRight}
				/>
			</div>

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
