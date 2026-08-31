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

import type { CSSProperties } from 'react';

/**
 * The default styling that React Native applies to every `<View>`, which
 * `react-native-web` used to emit for us. These components were ported from
 * React Native primitives to plain DOM elements, so we reproduce the defaults
 * explicitly rather than inheriting `<div>`'s block layout.
 *
 * @see https://necolas.github.io/react-native-web/docs/styling/
 */
export const viewBase: CSSProperties = {
	alignItems: 'stretch',
	boxSizing: 'border-box',
	display: 'flex',
	flexDirection: 'column',
	flexShrink: 0,
	minHeight: 0,
	minWidth: 0,
	position: 'relative',
};
