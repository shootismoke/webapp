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
import slugify from '@sindresorhus/slugify';
import c from 'classnames';
import { pipe } from 'fp-ts/lib/pipeable';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { useRouter } from 'next/router';
import React, { CSSProperties, useEffect, useState } from 'react';
import {
	OptionsType,
	OptionTypeBase,
	Props as SelectProps,
	StylesConfig,
} from 'react-select';
import AsyncSelect from 'react-select/async';

import location from '../../../assets/images/icons/location_orange.svg';
import search from '../../../assets/images/icons/search.svg';
import { City, logEvent, sentryException } from '../../util';
import { onGpsButtonClick } from '../GpsButton';

interface SearchBarProps extends SelectProps {
	cities: City[];
	className?: string;
	showGps?: boolean;
}

/**
 * Populate the search bar results with user's input.
 */
function algoliaLoadOptions(
	inputValue: string
): Promise<
	OptionsType<{
		label: string;
		value: { localeName: string; lat: number; lng: number };
	}>
> {
	return pipe(
		fetchAlgolia(inputValue),
		TE.map((items) =>
			items.map((item) => ({
				label: [
					item.locale_names && item.locale_names[0],
					item.city && item.city[0],
					item.county && item.county[0],
					item.country,
				]
					.filter((_) => _)
					.join(', '),
				value: {
					localeName: item.locale_names && item.locale_names[0],
					...item._geoloc,
				},
			}))
		),
		TE.fold((err) => {
			sentryException(err);

			return T.of([]);
		}, T.of)
	)();
}

function defaultCustomStyle(provided: CSSProperties): CSSProperties {
	return {
		...provided,
		color: '#44464A',
		fontSize: '0.9rem',
	};
}

const customStyles: StylesConfig<{ label: string; value: string }, false> = {
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
	input: (provided: CSSProperties): CSSProperties => {
		return {
			...provided,
			color: '#44464A',
			fontSize: '0.9rem',
			zIndex: 100, // This is so that the <input> is above the <img>, mainly for cypress tests to pass.
		};
	},
	noOptionsMessage: defaultCustomStyle,
	loadingMessage: defaultCustomStyle,
	option: defaultCustomStyle,
	placeholder: (provided: CSSProperties): CSSProperties => {
		return {
			...provided,
			color: '#44464A',
			fontSize: '0.9rem',
			width: '100%', // This is for truncate ellipsis.
		};
	},
	singleValue: (provided) => ({
		...provided,
		width: '80%',
	}),
};

export function SearchBar(props: SearchBarProps): React.ReactElement {
	const {
		cities,
		className,
		placeholder = 'Search a city or address',
		showGps = true,
		...rest
	} = props;

	const router = useRouter();

	// Create a lookup map for fast access.
	const [citiesMap, setCitiesMap] = useState<Record<string, true>>({});
	useEffect(() => {
		setCitiesMap(
			cities.reduce((acc, { slug }) => {
				if (slug) {
					acc[slug] = true;
				}

				return acc;
			}, {} as Record<string, true>)
		);
	}, [cities]);

	// If we have a more important message to show in the placeholder, we put
	// it here.
	const [overridePlaceholder, setOverridePlaceholder] = useState<
		string | undefined
	>(undefined);

	return (
		<div className="relative" data-cy="SearchBar-AsyncSelect">
			<AsyncSelect
				className={c('w-full rounded text-gray-700', className)}
				loadOptions={algoliaLoadOptions}
				noOptionsMessage={(): string => 'Type something...'}
				// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
				// @ts-ignore FIXME How to fix this?
				onChange={({ value }): void => {
					// If the input matches one of the slugs, then we redirect
					// to the slugged page.
					const sluggifiedCity = slugify(value.localeName || '');
					if (citiesMap[sluggifiedCity]) {
						router.push(`/city/${sluggifiedCity}`);
					} else {
						router.push(`/city?lat=${value.lat}&lng=${value.lng}`);
					}
				}}
				onFocus={(): void => logEvent('SearchBar.Input.Focus')}
				placeholder={
					<div className="flex items-center">
						<img
							alt="search"
							className="mr-2 flex-shrink-0"
							src={search}
						/>
						<span className="overflow-hidden truncate">
							{overridePlaceholder || placeholder}
						</span>

						{showGps && <div className="mr-4 w-6 flex-shrink-0" />}
					</div>
				}
				styles={customStyles}
				{...rest}
			/>
			{showGps && (
				<img
					alt="location"
					className="absolute top-0 mt-4 mr-4 right-0 w-4 cursor-pointer"
					onClick={(): void => {
						logEvent('SearchBar.LocationIcon.Click');
						onGpsButtonClick(setOverridePlaceholder, router);
					}}
					src={location}
				/>
			)}
		</div>
	);
}
