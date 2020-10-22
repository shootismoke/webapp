import { FrequencyContextProvider } from '@shootismoke/ui';
import React from 'react';

import './src/styles/global.css';

export const wrapRootElement = ({ element }) => (
	<FrequencyContextProvider>{element}</FrequencyContextProvider>
);
