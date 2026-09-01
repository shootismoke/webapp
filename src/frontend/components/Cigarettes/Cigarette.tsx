/**
 * This file is part of Sh**t! I Smoke.
 *
 * Copyright (C) 2018-2026  Marcelo S. Coelho, Amaury.
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

import React, { CSSProperties } from 'react';

import butt from '../../../../assets/images/cigarettes/butt.png';
import buttVertical from '../../../../assets/images/cigarettes/butt-vertical.png';
import head from '../../../../assets/images/cigarettes/head.png';
import headVertical from '../../../../assets/images/cigarettes/head-vertical.png';
import { viewBase } from './viewBase';

export type CigaretteOrientation = 'diagonal' | 'horizontal' | 'vertical';

interface CigaretteProps {
	percentage: number;
	orientation: CigaretteOrientation;
	fullCigaretteLength: number;
	style?: CSSProperties;
}

const styles: Record<string, CSSProperties> = {
	butt: {
		bottom: 0,
		left: 0,
		position: 'absolute',
	},
	diagonal: {
		...viewBase,
		transform: 'rotate(45deg) scale(1)',
	},
	head: {
		position: 'absolute',
		right: 0,
		top: 0,
		zIndex: 1,
	},
	inner: {
		...viewBase,
		bottom: 0,
		left: 0,
		overflow: 'hidden',
		position: 'absolute',
	},
};

/**
 * The percentage of cigarette length when `percentage=0`.
 */
const MIN_PERCENTAGE = 0.4;

/**
 * Given the full length of a cigarette, and the percentage of the cigarette
 * smoked, get the actual length of the cigarette.
 */
function getCigaretteActualLength(
	fullCigaretteLength: number,
	percentage: number
): number {
	return Math.ceil(
		((1 - MIN_PERCENTAGE) * percentage + MIN_PERCENTAGE) *
			fullCigaretteLength
	);
}

/**
 * A cigarette's width:height aspect ratio.
 */
const CIGARETTE_ASPECT_RATIO = 21 / 280;
const CIGARETTE_HEAD_HW_RATIO = 27 / 20;

function getContainerStyle(
	orientation: CigaretteOrientation,
	fullCigaretteLength: number
): CSSProperties {
	// Assuming the cigarette is vertical:
	const height = fullCigaretteLength;
	const width = height * CIGARETTE_ASPECT_RATIO;

	switch (orientation) {
		case 'horizontal':
			return { height: width, width: height };
		case 'vertical':
			return { height, width };
		default:
			return {};
	}
}

/**
 * Render a horizontal or vertical cigarette.
 */
function renderCigarette(
	orientation: CigaretteOrientation,
	percentage: number,
	fullCigaretteLength: number,
	additionalStyle?: CSSProperties
): React.ReactElement {
	// Assuming cigarette is vertical:
	const height = fullCigaretteLength;
	const width = height * CIGARETTE_ASPECT_RATIO;
	const actualHeight = getCigaretteActualLength(
		fullCigaretteLength,
		percentage
	);
	const isHorizontal = orientation === 'horizontal';

	return (
		<div
			style={{
				...viewBase,
				...getContainerStyle(orientation, fullCigaretteLength),
				...additionalStyle,
			}}
		>
			<div
				style={{
					...styles.inner,
					...(isHorizontal
						? { height: '100%', width: actualHeight }
						: { height: actualHeight, width: '100%' }),
				}}
			>
				<img
					alt=""
					src={(orientation === 'vertical' ? buttVertical : butt).src}
					style={{
						...styles.butt,
						...(isHorizontal
							? { height: '100%', width: fullCigaretteLength }
							: { height: fullCigaretteLength, width: '100%' }),
					}}
				/>
				<img
					alt=""
					src={(orientation === 'vertical' ? headVertical : head).src}
					style={{
						...styles.head,
						...(isHorizontal
							? {
									height: '100%',
									width: width * CIGARETTE_HEAD_HW_RATIO,
							  }
							: {
									height: width * CIGARETTE_HEAD_HW_RATIO,
									width: '100%',
							  }),
					}}
				/>
			</div>
		</div>
	);
}

export function Cigarette(props: CigaretteProps): React.ReactElement {
	const { orientation, percentage, fullCigaretteLength, style } = props;

	// Only used for diagonal. Assuming cigarette is vertical:
	const height = getCigaretteActualLength(fullCigaretteLength, percentage);
	const width = fullCigaretteLength * CIGARETTE_ASPECT_RATIO;

	// For diagonal cigarettes, we render a horizontal cigarette, and rotate it
	// 45deg.
	return orientation === 'diagonal' ? (
		<div
			style={{
				...viewBase,
				height: (height + width) / Math.SQRT2,
				width: (height + width) / Math.SQRT2,
				...style,
			}}
		>
			<div style={styles.diagonal}>
				{renderCigarette('horizontal', percentage, fullCigaretteLength)}
			</div>
		</div>
	) : (
		renderCigarette(orientation, percentage, fullCigaretteLength, style)
	);
}
