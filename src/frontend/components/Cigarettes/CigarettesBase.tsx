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

import { round } from '@shootismoke/ui';
import React, { CSSProperties } from 'react';

import { Cigarette, CigaretteOrientation } from './Cigarette';
import { viewBase } from './viewBase';

export interface CigarettesBaseProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
	/**
	 * The number of cigarettes to show.
	 */
	cigarettes: number;
	/**
	 * Additional styling for inner cigarettes
	 */
	cigaretteStyle?: CSSProperties;
	/**
	 * Length, in pixels, of a full cigarette.
	 *
	 * @default 90
	 */
	fullCigaretteLength?: number;
	/**
	 * The maximum number of cigarettes to show.
	 *
	 * @default 50
	 */
	showMaxCigarettes?: number;
	/**
	 * For small amount of cigarettes, we display them horizontally. After this
	 * number, they are displayed vertically.
	 *
	 * @default 4
	 */
	showVerticalAfter?: number;
	/**
	 * Horizontal spacing, in pixels, between the cigarettes, assuming the
	 * cigarettes are displayed vertically.
	 *
	 * @default 5
	 */
	spacingHorizontal?: number;
	/**
	 * Vertical spacing, in pixels, between the cigarettes, assuming the
	 * cigarettes are displayed vertically.
	 *
	 * @default 20
	 */
	spacingVertical?: number;
	style?: CSSProperties;
}

const innerContainer: CSSProperties = {
	...viewBase,
	alignContent: 'flex-end',
	alignItems: 'flex-end',
	flexDirection: 'row',
	flexWrap: 'wrap',
};

export function CigarettesBase(props: CigarettesBaseProps): React.ReactElement {
	const {
		cigarettes: realCigarettes,
		cigaretteStyle,
		fullCigaretteLength = 90,
		showMaxCigarettes = 50,
		showVerticalAfter = 4,
		spacingHorizontal = 5,
		spacingVertical = 20,
		style,
		...rest
	} = props;

	// We don't show more than `showMaxCigarettes` cigarettes, and we round to
	// 0.1.
	const cigarettes = round(
		Math.max(0.1, Math.min(realCigarettes, showMaxCigarettes))
	);

	const count = Math.floor(cigarettes); // The cigarette count, without decimal.
	const decimal = cigarettes - count;

	const orientation: CigaretteOrientation =
		cigarettes <= 1
			? 'diagonal'
			: cigarettes <= showVerticalAfter
			? 'horizontal'
			: 'vertical';

	const baseCigaretteStyle: CSSProperties | undefined =
		orientation === 'diagonal'
			? undefined
			: orientation === 'horizontal'
			? {
					marginBottom: spacingHorizontal,
					marginRight: spacingVertical,
			  }
			: {
					marginBottom: spacingVertical,
					marginRight: spacingHorizontal,
			  };

	return (
		<div style={{ ...innerContainer, ...style }} {...rest}>
			{cigarettes > 1 &&
				count >= 1 &&
				Array.from(Array(count)).map((_, i) => (
					<Cigarette
						key={i}
						orientation={orientation}
						percentage={1}
						fullCigaretteLength={fullCigaretteLength}
						style={{ ...baseCigaretteStyle, ...cigaretteStyle }}
					/>
				))}
			{(cigarettes === 1 || decimal > 0) && (
				<Cigarette
					orientation={orientation}
					percentage={decimal || 1}
					fullCigaretteLength={fullCigaretteLength}
					style={{ ...baseCigaretteStyle, ...cigaretteStyle }}
				/>
			)}
		</div>
	);
}
