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
import React from 'react';

import { SectionDivider } from './SectionDivider';

interface SectionProps extends React.HTMLProps<HTMLDivElement> {
	/**
	 * Remove padding from section content. Title still has padding.
	 */
	noPadding?: boolean;
	title?: string;
	titleClassName?: string;
}

export function Section({
	children,
	className,
	noPadding,
	title,
	titleClassName,
	...rest
}: SectionProps): React.ReactElement {
	return (
		<section
			className={c(
				'container mx-auto mt-16 md:mt-20 max-w-5xl',
				!noPadding && 'px-6 md:px-24',
				className
			)}
			{...rest}
		>
			{title && (
				<SectionDivider
					className={c('mb-6 md:mb-9', titleClassName)}
					title={title}
				/>
			)}
			{children}
		</section>
	);
}
