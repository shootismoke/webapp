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

import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { Cigarette } from './Cigarette';

interface CigarettesProps {
	/**
	 * The number of cigarettes to show.
	 */
	cigarettes: number;
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
	style?: StyleProp<ViewStyle>;
}

const styles = StyleSheet.create({
	innerContainer: {
		alignItems: 'flex-end',
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
});

export function Cigarettes(props: CigarettesProps): React.ReactElement {
	const {
		cigarettes: realCigarettes,
		fullCigaretteLength = 90,
		showMaxCigarettes = 50,
		showVerticalAfter = 4,
		spacingHorizontal = 5,
		spacingVertical = 20,
		style,
	} = props;

	// We don't show more than `showMaxCigarettes` cigarettes, and we round to
	// 0.1.
	const cigarettes =
		Math.round(
			Math.max(0.1, Math.min(realCigarettes, showMaxCigarettes)) * 10
		) / 10;

	const count = Math.floor(cigarettes); // The cigarette count, without decimal.
	const decimal = cigarettes - count;

	const orientation =
		cigarettes <= 1
			? 'diagonal'
			: cigarettes <= showVerticalAfter
			? 'horizontal'
			: 'vertical';

	return (
		<View style={style}>
			<View style={styles.innerContainer}>
				{cigarettes > 1 &&
					count >= 1 &&
					Array.from(Array(count)).map((_, i) => (
						<Cigarette
							key={i}
							orientation={orientation}
							percentage={1}
							fullCigaretteLength={fullCigaretteLength}
							style={
								orientation === 'horizontal'
									? {
											marginBottom: spacingHorizontal,
											marginRight: spacingVertical,
									  }
									: {
											marginBottom: spacingVertical,
											marginRight: spacingHorizontal,
									  }
							}
						/>
					))}
				{(cigarettes === 1 || decimal > 0) && (
					<Cigarette
						orientation={orientation}
						percentage={decimal || 1}
						fullCigaretteLength={fullCigaretteLength}
					/>
				)}
			</View>
		</View>
	);
}
