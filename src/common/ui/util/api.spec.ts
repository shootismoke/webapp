import { describe, expect, it } from '@jest/globals';

import { createApi, round } from './api';
import { testCases as testCasesBase } from './testutil';

describe('round', () => {
	it('should round numbers correctly', () => {
		expect(round(2)).toBe(2);
		expect(round(2.3)).toBe(2.3);
		expect(round(2.32)).toBe(2.3);
		expect(round(2.99)).toBe(3);
	});
});

describe('createApi', () => {
	const testCases = [
		{
			...testCasesBase[0],
			expected: {
				dailyCigarettes: 3.8454545454545452,
				distanceToStation: 12665,
				isAccurate: false,
			},
			gps: { latitude: 339.9289, longitude: 116.3883 },
		},
		{
			...testCasesBase[1],
			expected: {
				dailyCigarettes: 0.009090909090909092,
				distanceToStation: 12200,
				isAccurate: false,
			},
			gps: { latitude: 339.9289, longitude: 116.3883 },
		},
	];

	it('should work with testCases', () => {
		testCases.forEach((tc) => {
			const api = createApi(tc.gps, tc.results, new Date(tc.date));

			expect(api.shootismoke).toMatchObject(tc.expected);
		});
	});
});
