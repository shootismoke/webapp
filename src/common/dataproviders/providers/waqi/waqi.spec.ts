import { describe, expect, it } from '@jest/globals';

import { waqi } from './waqi';

describe('waqi', () => {
	describe('by station', () => {
		it('should throw on fetchByStation', async () => {
			await expect(waqi.fetchByStation('foo')).rejects.toThrow();
		});
	});
});
