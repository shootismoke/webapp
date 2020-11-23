import { render } from '@testing-library/react';
import React from 'react';

import { H1 } from './H1';

test('it should have the text passed as children ', () => {
	const { getByText } = render(<H1>Hi</H1>);
	expect(getByText('Hi')).toBeInTheDocument();
});
