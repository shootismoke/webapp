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

import { disabledOpacity, spacing, textColor } from '@common/ui';
import React, { ButtonHTMLAttributes, CSSProperties } from 'react';

interface BoxButtonProps
	extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
	active?: boolean;
	children: string | JSX.Element;
	style?: CSSProperties;
}

const styles: Record<string, CSSProperties> = {
	activeText: {
		opacity: 1,
	},
	boxButton: {
		alignItems: 'stretch',
		// `theme.elevationShadowStyle(3)`, with the shadow opacity lowered.
		backgroundColor: 'white',
		borderColor: 'rgba(0, 0, 0, 0.1)',
		borderRadius: 12,
		borderStyle: 'solid',
		borderWidth: 1,
		boxShadow: '0 3px 2.4px rgba(0, 0, 0, 0.1)',
		boxSizing: 'border-box',
		cursor: 'pointer',
		display: 'flex',
		flexDirection: 'column',
		marginBottom: spacing.mini,
		padding: `6px ${spacing.small}px`,
		textAlign: 'inherit',
	},
	boxButtonText: {
		// `theme.shitText`
		color: textColor,
		fontSize: 31,
		fontWeight: 800,
		letterSpacing: -1,
		lineHeight: '36px',
		opacity: disabledOpacity,
		textAlign: 'center',
	},
};

export function BoxButton(props: BoxButtonProps): React.ReactElement {
	const { active, children, style, ...rest } = props;

	return (
		<button
			type="button"
			style={{ ...styles.boxButton, ...style }}
			{...rest}
		>
			{typeof children === 'string' ? (
				<span
					style={{
						...styles.boxButtonText,
						...(active ? styles.activeText : undefined),
					}}
				>
					{children}
				</span>
			) : (
				children
			)}
		</button>
	);
}
