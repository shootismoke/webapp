import { describe, expect, it } from '@jest/globals';

import { getPollutantMeta, isPollutant } from './pollutant';
import { ugm3 } from './unit';

describe('isPollutant', () => {
	it('should return true for pm25', () => {
		expect(isPollutant('pm25')).toBe(true);
	});

	it('should return false for foo', () => {
		expect(isPollutant('foo')).toBe(false);
	});
});

describe('getPollutantMeta', () => {
	it('should return correct metadata', () => {
		expect(getPollutantMeta('pm25')).toEqual({
			name: 'pm25',
			displayName: 'PM2.5',
			description:
				'Particulate matter less than 2.5 micrometers in diameter mass concentration',
			preferredUnit: ugm3,
			id: 2,
			isCore: true,
			maxColorValue: 110,
		});
	});
});
