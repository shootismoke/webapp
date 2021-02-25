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

import { Cigarettes as CigarettesBase } from '@shootismoke/ui/lib/components/Cigarettes';
import React from 'react';

// Total height of the box containing cigarettes.
const BOX_HEIGHT = 128; // Or 8rem.

// Empirically, 100 cigarettes of length 120 fit into 1 line.
const N_CIGARETTES_1_LINE = 100;

// Show vertical cigarettes after this amount.
const SHOW_VERTICAL_AFTER = 4;

interface CigaretteConfig {
	fullCigaretteLength: number;
	spacingHorizontal: number;
	spacingVertical: number;
}

/**
 * Depending on how many we show, decide on the size of one cigarette.
 *
 * @param cigarettes - The cigarettes count.
 */
function getCigaretteConfig(cigarettes: number): CigaretteConfig {
	if (cigarettes <= 1) {
		// | cigarettes | length                  |
		// | ---------- | ------------------------|
		// | 1          | BOX_HEIGHT              |
		// | 0.1        | 50                      |
		// | x          | (BOX_HEIGHT-50)/(1-0.1) |

		// If we note: length = a * cigarretes + b, then:
		const a = (BOX_HEIGHT - 200) / (1 - 0.1);
		const b = 128 - a;
		return {
			fullCigaretteLength: a * cigarettes + b,
			spacingHorizontal: 0,
			spacingVertical: 0,
		};
	} else if (cigarettes <= SHOW_VERTICAL_AFTER) {
		const SPACING = 15; // 15px between cigarettes.

		// Contract: 4*20.75 + 3*15 = BOX_HEIGHT.
		return {
			fullCigaretteLength: 275, // Height: 20.75px.
			spacingHorizontal: SPACING,
			spacingVertical: 0,
		};
	} else if (cigarettes <= N_CIGARETTES_1_LINE) {
		// Contract: fullCigaretteLength = BOX_HEIGHT.
		return {
			fullCigaretteLength: BOX_HEIGHT,
			spacingHorizontal: 5,
			spacingVertical: 0,
		};
	} else {
		// Contract: 2*44 + 2*20 = BOX_HEIGHT.
		return {
			fullCigaretteLength: 44,
			spacingHorizontal: 5,
			spacingVertical: 20,
		};
	}
}

interface CigarettesProps {
	cigarettes: number;
}

export function Cigarettes(props: CigarettesProps): React.ReactElement {
	const { cigarettes } = props;

	const cigaretteConfig = getCigaretteConfig(cigarettes);

	return (
		<CigarettesBase
			cigarettes={cigarettes}
			showMaxCigarettes={N_CIGARETTES_1_LINE * 2}
			showVerticalAfter={SHOW_VERTICAL_AFTER}
			{...cigaretteConfig}
			cigaretteStyle={{
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore Not yet supported on RN, but works on browser.
				transform: 'translateY(2px)', // Empirically, without the -2, the cigarette is cut off.
				transformOrigin: 'top left',
			}}
			style={{
				flexWrap:
					SHOW_VERTICAL_AFTER < cigarettes &&
					cigarettes <= N_CIGARETTES_1_LINE
						? 'nowrap'
						: 'wrap',
				height: cigarettes <= 1 ? `${BOX_HEIGHT}px` : undefined,

				// This is so that horizontal cigarettes wrap correctly.
				maxWidth: cigarettes <= SHOW_VERTICAL_AFTER ? '300px' : '100%',
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore Not yet supported on RN, but works on browser.
				overflowX:
					SHOW_VERTICAL_AFTER < cigarettes &&
					cigarettes <= N_CIGARETTES_1_LINE
						? 'scroll'
						: 'hidden',
				overflowY: 'hidden',
			}}
		/>
	);
}
