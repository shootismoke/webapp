import { expect } from '@jest/globals';

import * as aqiCodes from '../aqi';
import { convert } from '../convert';
import { AqiCode } from '../types';
import { round } from './breakpoints';
import { getPollutantMeta, Pollutant } from './pollutant';

/**
 * Small utility function to step AQI/ugm3 conversions for a pollutant
 */
export function testConvert(
	aqiCode: AqiCode,
	pollutant: Pollutant,
	aqi: number,
	ugm3: number
): void {
	it(`should convert ${pollutant}: ${
		aqiCodes[aqiCode].displayName
	} ${aqi} = ${ugm3}${getPollutantMeta(pollutant).preferredUnit}`, () => {
		// Sometimes, because of rounding, the values are not exact. We just want
		// them to be exact at +/-0.2
		expect(
			round(Math.abs(convert(pollutant, aqiCode, 'µg/m³', aqi) - ugm3), 1)
		).toBeLessThanOrEqual(0.2);
		expect(
			round(Math.abs(convert(pollutant, 'µg/m³', aqiCode, ugm3) - aqi), 1)
		).toBeLessThanOrEqual(0.2);
	});
}
