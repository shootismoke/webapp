/**
 * This file is part of Sh**t! I Smoke.
 *
 * Copyright (C) 2018-2021  Marcelo S. Coelho, Amaury Martiny.
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
import React from 'react';

export interface TipProps {
	children:
		| React.ReactElement
		| undefined
		| (React.ReactElement | undefined)[];
	className?: string;
	imgAlt: string;
	imgSrc: string;
}

export function Tip({
	children,
	className,
	imgAlt,
	imgSrc,
}: TipProps): React.ReactElement {
	return (
		<div className={c('flex flex-row items-center', className)}>
			<div
				className="next-images relative | mr-4"
				style={{ minHeight: '42px', minWidth: '42px' }}
			>
				<Image
					alt={imgAlt}
					layout="fill"
					objectFit="contain"
					src={imgSrc}
				/>
			</div>

			{children}
		</div>
	);
}
