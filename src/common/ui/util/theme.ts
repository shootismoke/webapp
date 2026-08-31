// Sh**t! I Smoke
// Copyright (C) 2018-2021  Marcelo S. Coelho, Amaury M.

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

export const backgroundColor = '#FAFAFC';
export const iconBackgroundColor = '#EBE7DD';
export const primaryColor = '#F8A65D';
export const textColor = '#44464A';
export const secondaryTextColor = '#8B909A';
export const spacing = {
	tiny: 5,
	mini: 10,
	small: 15,
	normal: 20,
	big: 36,
};

/**
 * Opacity for views that are disabled.
 */
export const disabledOpacity = 0.3;

export const link = {
	color: primaryColor,
	textDecorationLine: 'underline' as const,
};

/**
 * Big text with "Sh*t! I smoked...""
 */
export const shitText = {
	color: textColor,
	fontSize: 31,
	fontWeight: '800' as const,
	letterSpacing: -1,
	lineHeight: 36,
};

/**
 * Normal text
 */
export const text = {
	color: secondaryTextColor,
	fontSize: 11,
	letterSpacing: 0.85,
	lineHeight: 15,
};

export const title = {
	letterSpacing: 3.14,
	lineHeight: 18,
	color: textColor,
	fontSize: 12,
	fontWeight: '800' as const,
};

export const withLetterSpacing = {
	letterSpacing: 2,
};

export const withPadding = {
	paddingHorizontal: spacing.normal,
};
