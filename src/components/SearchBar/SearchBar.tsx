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

import { fetchAlgolia } from '@shootismoke/ui/lib/util/fetchAlgolia';
import c from 'classnames';
import { pipe } from 'fp-ts/lib/pipeable';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { navigate } from 'gatsby';
import React, { useState } from 'react';
import {
	OptionsType,
	OptionTypeBase,
	Props as SelectProps,
	StylesConfig,
} from 'react-select';
import AsyncSelect from 'react-select/async';

import location from '../../../assets/images/icons/location.svg';

interface SearchBarProps extends SelectProps {
	className?: string;
}

/**
 * Populate the search bar results with user's input.
 */
function algoliaLoadOptions(
	inputValue: string
): Promise<OptionsType<OptionTypeBase>> {
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

const customStyles: StylesConfig = {
	control: (provided) => ({
		...provided,
		borderRadius: '10px',
		borderWidth: 1,
		padding: '5px',
	}),
	indicatorsContainer: (provided) => ({
		...provided,
		display: 'none',
	}),

	singleValue: (provided) => ({
		...provided,
		width: '80%',
	}),
};

/**
 * Interface that is used for passing data through state in @reach/router
 * transitions.
 */
export interface SearchLocationState {
	cityName: string;
}

const DEFAULT_PLACEHOLDER = 'Check the air quality of your city...';

export function SearchBar(props: SearchBarProps): React.ReactElement {
	const { className, ...rest } = props;

	const [placeholder, setPlaceholder] = useState(DEFAULT_PLACEHOLDER);

	return (
		<div className="relative">
			<AsyncSelect
				className={c('w-full rounded', className)}
				loadOptions={algoliaLoadOptions}
				noOptionsMessage={(): string => 'Type something...'}
				// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
				// @ts-ignore FIXME How to fix this?
				onChange={({ label, value }): void => {
					navigate(`/city?lat=${value.lat}&lng=${value.lng}`, {
						state: {
							cityName: label,
						} as SearchLocationState,
					});
				}}
				placeholder={placeholder}
				styles={customStyles}
				{...rest}
			/>
			<img
				alt="location"
				className="absolute top-0 mt-3 mr-3 right-0 w-6 cursor-pointer"
				onClick={(): void => {
					setPlaceholder("Fetching browser's GPS location...");
					if (!navigator.geolocation) {
						setPlaceholder(
							'Error: Geolocation is not supported for this Browser/OS.'
						);
						setTimeout(
							() => setPlaceholder(DEFAULT_PLACEHOLDER),
							1500
						);
					} else {
						navigator.geolocation.getCurrentPosition(
							(position) => {
								navigate(
									`/city?lat=${position.coords.latitude}&lng=${position.coords.longitude}`
								);
							},
							(err) => {
								setPlaceholder(`Error: ${err.message}`);
								setTimeout(
									() => setPlaceholder(DEFAULT_PLACEHOLDER),
									1500
								);
							}
						);
					}
				}}
				src={location}
			/>
		</div>
	);
}
