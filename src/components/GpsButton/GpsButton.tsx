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

import { Button } from '@shootismoke/ui';
import { navigate } from 'gatsby';
import React, { useState } from 'react';

export function GpsButton(): React.ReactElement {
	const [text, setText] = useState('Show my current city');

	return (
		<Button
			onPress={(): void => {
				setText('Fetching your GPS location...');

				if (!navigator.geolocation) {
					setText(
						'Geolocation is not supported for this Browser/OS.'
					);
					console.warn(
						'Geolocation is not supported for this Browser/OS.'
					);
				} else {
					navigator.geolocation.getCurrentPosition(
						(position) => {
							navigate(
								`/city?lat=${position.coords.latitude}&lng=${position.coords.longitude}`
							);
						},
						(err) => {
							setText(err.message);
							console.error(err);
						}
					);
				}
			}}
		>
			{text}
		</Button>
	);
}
