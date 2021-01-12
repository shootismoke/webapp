import '../styles/globals.css';

import type { AppProps } from 'next/app';
import React from 'react';
import { FrequencyContextProvider } from '@shootismoke/ui/lib/context';

export default function App({
	Component,
	pageProps,
}: AppProps): React.ReactElement {
	return (
		<FrequencyContextProvider>
			<Component {...pageProps} />
		</FrequencyContextProvider>
	);
}
