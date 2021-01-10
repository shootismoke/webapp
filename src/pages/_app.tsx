import '../styles/globals.css';

import type { AppProps } from 'next/app';
import React from 'react';

export default function App({
	Component,
	pageProps,
}: AppProps): React.ReactElement {
	return <Component {...pageProps} />;
}
