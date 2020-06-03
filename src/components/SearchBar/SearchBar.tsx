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

import { fetchAlgolia } from '@shootismoke/ui/lib/util/fetchAlgolia';
import c from 'classnames';
import { pipe } from 'fp-ts/lib/pipeable';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { navigate } from 'gatsby';
import React from 'react';
import { OptionsType, OptionTypeBase } from 'react-select';
import AsyncSelect from 'react-select/async';

interface SearchBarProps {
	className?: string;
}

/**
 * Populate the search bar results with user's input.
 */
function loadOptions(inputValue: string): Promise<OptionsType<OptionTypeBase>> {
	return pipe(
		fetchAlgolia(inputValue),
		TE.map((items) =>
			items.map((item) => ({
				label: [
					item.locale_names[0],
					item.city,
					item.county && item.county.length ? item.county[0] : null,
					item.country,
				]
					.filter((_) => _)
					.join(', '),
				value: item._geoloc,
			}))
		),
		TE.fold((err) => {
			console.error(err);

			return T.of([]);
		}, T.of)
	)();
}

export function SearchBar(props: SearchBarProps): React.ReactElement {
	const { className } = props;

	return (
		<>
			<AsyncSelect
				className={c('border w-full', className)}
				loadOptions={loadOptions}
				noOptionsMessage={(): string =>
					'Type something to look for a city...'
				}
				// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
				// @ts-ignore FIXME How to fix this?
				onChange={({ label, value }): void => {
					navigate(`/city?lat=${value.lat}&lng=${value.lng}`, {
						state: {
							name: label,
						},
					});
				}}
				placeholder="Search any location"
			/>
		</>
	);
}
