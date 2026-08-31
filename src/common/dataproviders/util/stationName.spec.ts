import { describe, expect, it } from '@jest/globals';

import { OpenAQResult } from './openaq';
import { stationName } from './stationName';

describe('stationName', () => {
	it('should take attribution if it exists', () => {
		expect(
			stationName({ attribution: [{ name: 'foo' }] } as OpenAQResult)
		).toBe('foo');
	});

	it('should take location name', () => {
		expect(stationName({ location: 'foo' } as OpenAQResult)).toBe(
			'Station foo'
		);
	});
});
