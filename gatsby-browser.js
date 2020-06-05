import { FrequencyContextProvider } from '@shootismoke/ui';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { translations } from './src/localization/i18n';

import './src/styles/global.css';

export const wrapRootElement = ({ element }) => (
	<IntlProvider locale="en-US" messages={translations['en-US']}>
		<FrequencyContextProvider>{element}</FrequencyContextProvider>
	</IntlProvider>
);
