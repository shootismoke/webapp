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
import { pipe } from 'fp-ts/lib/pipeable';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import React from 'react';
import { OptionsType, OptionTypeBase } from 'react-select';
import AsyncSelect from 'react-select/async';

function loadOptions(inputValue: string): Promise<OptionsType<OptionTypeBase>> {
	console.log('LOAD');
	return pipe(
		fetchAlgolia(inputValue),
		TE.map((items) =>
			items.map((item) => ({
				label: item.city,
				value: item._geoloc,
			}))
		),
		TE.fold((err) => {
			console.error(err);

			return T.of([]);
		}, T.of)
	)();
}

export function SearchBar(): React.ReactElement {
	return (
		<>
			<AsyncSelect
				className="border w-full"
				loadOptions={loadOptions}
				placeholder="Search any location"
			/>
		</>
	);
}
