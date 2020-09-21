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

/**
 * Depending on how many we show, decide on the size of one cigarette.
 *
 * @param cigarettes - The cigarettes count.
 */
function fullCigaretteLength(cigarettes: number): number {
	if (cigarettes <= 1) {
		return 150;
	} else if (cigarettes <= 4) {
		return 200;
	} else if (cigarettes <= 59) {
		// Empirically, 59 cigarettes of length 120 fit into 1 line.
		return 120;
	} else {
		return 50;
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
			style={{
				maxHeight: '128px',
				// This is so that horizontal cigarettes wrap correctly.
				maxWidth: cigarettes <= 4 ? '300px' : '100%',
				overflow: 'hidden',
			}}
		/>
	);
}
