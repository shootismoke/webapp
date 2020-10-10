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

import { Cigarettes as CigarettesBase } from '@shootismoke/ui';
import React from 'react';

// Total height of the box containing cigarettes.
const BOX_HEIGHT = 140;

// Empirically, 95 cigarettes of length 120 fit into 1 line.
const N_CIGARETTES_1_LINE = 95;

// Show vertical cigarettes after this amount.
const SHOW_VERTICAL_AFTER = 4;

/**
 * Depending on how many we show, decide on the size of one cigarette.
 *
 * @param cigarettes - The cigarettes count.
 */
function fullCigaretteLength(cigarettes: number): number {
	if (cigarettes <= 1) {
		return 150;
	} else if (cigarettes <= SHOW_VERTICAL_AFTER) {
		return 250;
	} else if (cigarettes <= N_CIGARETTES_1_LINE) {
		return BOX_HEIGHT;
	} else {
		return 50; // Note: 2*50 + 2*20 = BOX_HEIGHT.
	}
}

interface CigarettesProps {
	cigarettes: number;
}

export function Cigarettes(props: CigarettesProps): React.ReactElement {
	const { cigarettes } = props;

	return (
		<CigarettesBase
			cigarettes={cigarettes}
			fullCigaretteLength={fullCigaretteLength(cigarettes)}
			showMaxCigarettes={200}
			showVerticalAfter={SHOW_VERTICAL_AFTER}
			spacingHorizontal={cigarettes <= SHOW_VERTICAL_AFTER ? 15 : 5}
			spacingVertical={cigarettes <= N_CIGARETTES_1_LINE ? 0 : 20}
			style={{
				flexWrap:
					SHOW_VERTICAL_AFTER < cigarettes &&
					cigarettes <= N_CIGARETTES_1_LINE
						? 'nowrap'
						: 'wrap',
				maxHeight: `${BOX_HEIGHT}px`,
				// This is so that horizontal cigarettes wrap correctly.
				maxWidth: cigarettes <= SHOW_VERTICAL_AFTER ? '300px' : '100%',
				overflow:
					cigarettes <= N_CIGARETTES_1_LINE ? 'scroll' : 'hidden',
			}}
		/>
	);
}
