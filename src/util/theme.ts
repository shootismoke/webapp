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

import Constants from 'expo-constants';
import { Platform, ViewStyle } from 'react-native';

export type Scale = (before: number) => number

export type ShadowPosition = 'top' | 'bottom';

export interface ThemeOptions {
	scale?: Scale
}

export function _theme({ scale = x => x }: ThemeOptions = {}) {

	const backgroundColor = '#FAFAFC';
	const gothamBlack = 'gotham-black';
	const iconBackgroundColor = '#EBE7DD';
	const gotham = 'gotham-book';
	const primaryColor = '#F8A65D';
	const textColor = '#44464A';
	const secondaryTextColor = '#8B909A';
	const spacing = {
		tiny: scale(5),
		mini: scale(10),
		small: scale(15),
		normal: scale(20),
		big: scale(36),
	};

	/**
	 * The Gotham font seems like not 100% aligned vertically in the middle,even
	 * when everything's configured in the middle, just remove this and see for
	 * youself.
	 * FIXME
	 */
	const fixTextMargin = {
		...Platform.select({
			ios: {
				marginTop: scale(3),
			},
		}),
	};

	/**
	 * Opacity for views that are disabled.
	 */
	const disabledOpacity = 0.3;

	/**
	 * Get consistent shadows between iOS and Android
	 * @see https://stenbeck.io/styling-shadows-in-react-native-ios-and-android/
	 */
	function elevationShadowStyle(
		elevation: number,
		position: ShadowPosition = 'bottom'
	): ViewStyle {
		return {
			elevation,
			shadowColor: 'black',
			shadowOffset: {
				width: 0,
				height: scale((position === 'bottom' ? 1 : -1) * elevation),
			},
			shadowOpacity: disabledOpacity,
			shadowRadius: scale(0.8 * elevation),
		};
	}

	const fullScreen = {
		backgroundColor,
		flexGrow: 1,
		paddingTop: Constants.statusBarHeight,
	};

	const link = {
		color: primaryColor,
		fontFamily: gotham,
		textDecorationLine: 'underline' as const,
	};

	/**
	 * Big text with "Sh*t! I smoked...""
	 */
	const shitText = {
		color: textColor,
		fontFamily: gothamBlack,
		fontSize: scale(31),
		letterSpacing: scale(-1),
		lineHeight: scale(36),
		...fixTextMargin,
	};

	/**
	 * Normal text
	 */
	const text = {
		color: secondaryTextColor,
		fontFamily: gotham,
		fontSize: scale(11),
		letterSpacing: scale(0.85),
		lineHeight: scale(15),
	};

	const title = {
		letterSpacing: scale(3.14),
		lineHeight: scale(18),
		color: textColor,
		fontFamily: gothamBlack,
		fontSize: scale(12),
		...fixTextMargin,
	};

	const withLetterSpacing = {
		letterSpacing: scale(2),
	};

	const withPadding = {
		paddingHorizontal: spacing.normal,
	};

	return {
		backgroundColor, gothamBlack, iconBackgroundColor, gotham, primaryColor, textColor, secondaryTextColor,
		spacing, fixTextMargin, disabledOpacity, elevationShadowStyle, fullScreen, link, shitText, text, title, withLetterSpacing, withPadding
	}
}

export const theme = _theme()
