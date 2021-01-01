import React from 'react';

import { wrapRootElement } from './gatsby-browser';

import './src/styles/global.css';

export { wrapRootElement };

export const onRenderBody = ({ setPostBodyComponents }) => {
	setPostBodyComponents([
		<script
			type="text/javascript"
			src="https://s.skimresources.com/js/180152X1649450.skimlinks.js"
		></script>,
	]);
};
