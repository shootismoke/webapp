import '../styles/globals.css';

import { FrequencyContextProvider } from '@shootismoke/ui/lib/context';
import type { AppProps } from 'next/app';
import React from 'react';

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
