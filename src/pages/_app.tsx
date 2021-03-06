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

import '../frontend/styles/globals.css';

import { FrequencyContextProvider } from '@shootismoke/ui';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { logEvent } from '../frontend/util';

export default function App({
	Component,
	pageProps,
}: AppProps): React.ReactElement {
	const router = useRouter();

	useEffect(() => {
		logEvent('Route.Update', { location: router.pathname });
	}, [router.pathname]);

	return (
		<FrequencyContextProvider>
			<Component {...pageProps} />
		</FrequencyContextProvider>
	);
}
