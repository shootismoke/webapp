import { describe, expect, it } from '@jest/globals';

import { getSwearWord } from './swearWords';

describe('getSwearWord', () => {
	it('should get correct swear words', () => {
		expect(getSwearWord(0.2)).toBe('home_cigarettes_oh');
		expect(getSwearWord(432)).toBeTruthy();
	});
});
