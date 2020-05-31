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

import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ViewProps } from 'react-native';

import { Frequency } from '../../util/race';
import * as theme from '../../util/theme';
import { Cigarettes } from '../Cigarettes';
import loadingAnimation from './animation.json';
import { swearWords } from './swearWords';

export type Translate = (
	keyword: string,
	replace?: Record<string, string>
) => string;

interface CigaretteBlockProps extends ViewProps {
	cigarettes: number;
	frequency?: Frequency;
	loading?: boolean;
	t: Translate;
}

const styles = StyleSheet.create({
	animationContainer: {
		display: 'flex',
		justifyContent: 'flex-end',
	},
	cigarettesCount: {
		color: theme.primaryColor,
	},
	lottie: {
		backgroundColor: theme.backgroundColor,
	},
	shit: {
		// ...theme.shitText,
		// marginTop: theme.spacing.normal,
	},
});

function getSwearWord(cigaretteCount: number, t: Translate): string {
	if (cigaretteCount <= 1) return t('home_cigarettes_oh');

	// Return a random swear word
	return swearWords(t)[Math.floor(Math.random() * swearWords.length)];
}

function renderAnimation(): React.ReactElement {
	return (
		<View style={styles.animationContainer}>
			<LottieView
				autoPlay
				autoSize
				source={loadingAnimation}
				style={styles.lottie}
			/>
		</View>
	);
}

export function CigaretteBlock(props: CigaretteBlockProps): React.ReactElement {
	const { cigarettes, frequency, loading, style, t, ...rest } = props;

	// Decide on a swear word. The effect says that the swear word only changes
	// when the cigarettes count changes.
	const [swearWord, setSwearWord] = useState(getSwearWord(cigarettes, t));
	useEffect(() => {
		setSwearWord(getSwearWord(cigarettes, t));
	}, [cigarettes]);

	const renderCigarettesText = (): React.ReactElement => {
		if (loading) {
			// FIXME i18n
			return (
				<Text style={styles.shit}>
					Loading<Text style={styles.cigarettesCount}>...{'\n'}</Text>
				</Text>
			);
		}

		// Round to 1 decimal
		const cigarettesRounded = Math.round(cigarettes * 10) / 10;

		return (
			<Text style={styles.shit}>
				{t('home_cigarettes_smoked_pastPresent')}
				<Text style={styles.cigarettesCount}>
					{t('home_cigarettes_count', {
						cigarettes: `${cigarettesRounded}`,
						singularPlural:
							cigarettesRounded === 1
								? t('home_cigarettes_cigarette').toLowerCase()
								: t('home_cigarettes_cigarettes').toLowerCase(),
					})}
				</Text>
				{frequency}
			</Text>
		);
	};

	return (
		<View style={style} {...rest}>
			{loading ? (
				renderAnimation()
			) : (
				<Cigarettes cigarettes={cigarettes} />
			)}
			{renderCigarettesText()}
		</View>
	);
}
