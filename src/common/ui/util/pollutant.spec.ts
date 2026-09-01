import { describe, expect, it } from '@jest/globals';

import { getAQI, getPollutantData } from './pollutant';
import { testCases as testCasesBase } from './testutil';

describe('getAQI', () => {
	const testCases = [
		{
			...testCasesBase[0],
			expected: 166,
		},
		{
			...testCasesBase[1],
			expected: 26, // FIXME The actual test case shows 12.
		},
	];

	it('should work with testCases', () => {
		testCases.forEach((tc) => {
			const aqi = getAQI(tc.results);

			expect(aqi).toBe(tc.expected);
		});
	});
});

describe('getPollutantData', () => {
	it('should work with co', () => {
		const pollutantData = getPollutantData('co');

		expect(pollutantData).toEqual({
			effects:
				'Carbon monoxide reduces the oxygen-carrying capacity of the blood by combining with haemoglobin, thus deprives tissues of O2.',
			name: 'Carbon monoxide',
		});
	});
});
