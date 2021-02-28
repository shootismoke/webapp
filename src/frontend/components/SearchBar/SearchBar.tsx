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

import type { CSSObject } from '@emotion/serialize';
import { fetchAlgolia } from '@shootismoke/ui';
import slugify from '@sindresorhus/slugify';
import c from 'classnames';
import { pipe } from 'fp-ts/lib/pipeable';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { NextRouter, useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Props as SelectProps, StylesConfig } from 'react-select';
import AsyncSelect from 'react-select/async';

import location from '../../../../assets/images/icons/location_orange.svg';
import search from '../../../../assets/images/icons/search.svg';
import { City, logEvent, sentryException } from '../../util';

interface SearchBarProps extends SelectProps<AlgoliaOption, false> {
	cities: City[];
	className?: string;
	showGps?: boolean;
}

interface AlgoliaOption {
	label: string | React.ReactElement;
	value:
		| {
				localeName: string;
				lat: number;
				lng: number;
		  }
		| 'USE_GPS';
}

/**
 * Populate the search bar results with user's input.
 */
function algoliaLoadOptions(
	inputValue: string
): Promise<ReadonlyArray<AlgoliaOption>> {
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

function defaultCustomStyle(provided: CSSObject): CSSObject {
	return {
		...provided,
		color: '#44464A',
		fontSize: '0.9rem',
	};
}

const customStyles: StylesConfig<AlgoliaOption, false> = {
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
	input: (provided: CSSObject): CSSObject => {
		return {
			...provided,
			color: '#44464A',
			fontSize: '0.9rem',
			zIndex: 100, // This is so that the <input> is above the <Image>, mainly for cypress tests to pass.
		};
	},
	menu: (provided: CSSObject): CSSObject => {
		return {
			...provided,
			minHeight: '200px',
		};
	},
	noOptionsMessage: defaultCustomStyle,
	loadingMessage: defaultCustomStyle,
	option: defaultCustomStyle,
	placeholder: (provided: CSSObject): CSSObject => {
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

/**
 * Handler when a user clicks on a button to fetch browser's GPS.
 *
 * @param setStatus - A function to set the status of the GPS fetch.
 */
function onGps(
	setStatus: (status: string | undefined) => void,
	router: NextRouter
): void {
	setStatus("Fetching browser's GPS location...");
	if (!navigator.geolocation) {
		setStatus(
			'❌ Error: Geolocation is not supported for this Browser/OS.'
		);
		setTimeout(() => setStatus(undefined), 1500);
	} else {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				router
					.push(
						`/city?lat=${position.coords.latitude}&lng=${position.coords.longitude}`
					)
					.catch((err) => {
						setStatus(`❌ Error: ${(err as Error).message}`);
						setTimeout(() => setStatus(undefined), 1500);
					});
			},
			(err) => {
				setStatus(`❌ Error: ${err.message}`);
				setTimeout(() => setStatus(undefined), 1500);
			}
		);
	}
}

// Default options to show when user didn't type anything in the input.
const defaultOptions: AlgoliaOption[] = [
	{
		label: (
			<div className="flex items-center">
				<img
					alt="location"
					className="mr-2 flex-shrink-0"
					src={location}
				/>
				<span className="overflow-hidden truncate text-orange">
					Use my location instead
				</span>
			</div>
		),
		value: 'USE_GPS',
	},
];

/**
 * Render an option in the dropdown.
 */
function renderOption(
	text: string,
	img?: string,
	imgAlt?: string
): React.ReactElement {
	return (
		<div className="flex items-center">
			{img && (
				<img alt={imgAlt} className="mr-2 flex-shrink-0" src={img} />
			)}
			<span className="overflow-hidden truncate">{text}</span>
		</div>
	);
}

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

	// Is the input focused?
	const [isFocused, setIsFocused] = useState(false);

	// The current chosen option in the dropdown.
	const [option, setOption] = useState<AlgoliaOption | null>(null);
	// When the option is;
	// - a city: we change URL to the city page,
	// - USE_GPS: we ask for user's location.
	useEffect(() => {
		if (!option) {
			return;
		}

		const { label, value } = option;

		if (value === 'USE_GPS') {
			setOption(null);
			logEvent('SearchBar.Input.Gps');
			onGps(setOverridePlaceholder, router);

			return;
		}

		// If the input matches one of the slugs, then we redirect
		// to the slugged page.
		const sluggifiedCity = slugify(value.localeName || '');
		if (citiesMap[sluggifiedCity]) {
			router.push(`/city/${sluggifiedCity}`).catch(sentryException);
		} else {
			router
				.push(
					`/city?lat=${value.lat}&lng=${value.lng}&name=${
						label as string
					}`
				)
				.catch(sentryException);
		}
	}, [option, citiesMap, router]);

	// If we have a more important message to show in the placeholder, we put
	// it here.
	const [overridePlaceholder, setOverridePlaceholder] = useState<
		string | undefined
	>(undefined);

	return (
		<div className="relative" data-cy="SearchBar-AsyncSelect">
			<AsyncSelect<AlgoliaOption, false>
				className={c('w-full rounded text-gray-700', className)}
				defaultOptions={defaultOptions}
				// https://stackoverflow.com/questions/61290173/react-select-how-do-i-resolve-warning-prop-id-did-not-match
				instanceId={1}
				loadOptions={algoliaLoadOptions}
				onChange={setOption}
				onFocus={(): void => {
					setIsFocused(true);
					logEvent('SearchBar.Input.Focus');
				}}
				onBlur={() => setIsFocused(false)}
				placeholder={
					overridePlaceholder ? (
						renderOption(overridePlaceholder)
					) : isFocused ? (
						<span className="text-gray-600">Type something...</span>
					) : (
						renderOption(placeholder as string, search, 'search')
					)
				}
				styles={customStyles}
				value={option}
				{...rest}
			/>
			{showGps && !isFocused && (
				<img
					alt="location"
					className="absolute top-0 mt-4 mr-4 right-0 w-4 cursor-pointer"
					onClick={(): void => {
						logEvent('SearchBar.LocationIcon.Click');
						onGps(setOverridePlaceholder, router);
					}}
					src={location}
				/>
			)}
		</div>
	);
}
