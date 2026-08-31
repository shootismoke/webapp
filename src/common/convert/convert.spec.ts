import { describe, expect, it } from '@jest/globals';

import { convert } from './convert';

describe('convert', () => {
	it('should return the same value for ugm3->ugm3 conversion', () => {
		expect(convert('pm25', 'µg/m³', 'µg/m³', 45)).toBe(45);
	});

	it('should throw an error on ppb', () => {
		expect(() => convert('pm25', 'ppm', 'ppb', 1)).toThrowError(
			'Conversion from ppm to ppb not supported yet.'
		);
	});
});
