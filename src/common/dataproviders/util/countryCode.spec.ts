import { describe, expect, it } from '@jest/globals';

import { getCountryCode } from './countryCode';

describe('getCountryCode', () => {
	it('should match exact country', () => {
		expect(getCountryCode('United States')).toEqual('US');
	});

	it('should match lower case', () => {
		expect(getCountryCode('united states')).toEqual('US');
	});

	it('should match multiple spacing', () => {
		expect(getCountryCode('united  states')).toEqual('US');
	});

	it('should match dashed', () => {
		expect(getCountryCode('saudi-arabia')).toEqual('SA');
	});

	it('should match included string', () => {
		expect(getCountryCode('United States Of America')).toEqual('US');
	});
});
