import { describe, expect, it } from '@jest/globals';

import { convert } from '../../convert';
import { testConvert } from '../../util/testUtil';
import { usaEpa } from './usaEpa';

describe('Convert pm25', () => {
	testConvert('usaEpa', 'pm25', 25, 6);
	testConvert('usaEpa', 'pm25', 39, 9.35);
	testConvert('usaEpa', 'pm25', 57, 15);
	testConvert('usaEpa', 'pm25', 75, 23.5);
	testConvert('usaEpa', 'pm25', 125, 45.2);
	testConvert('usaEpa', 'pm25', 175, 102);
	testConvert('usaEpa', 'pm25', 250, 199.9);
	testConvert('usaEpa', 'pm25', 285, 235.4);
	testConvert('usaEpa', 'pm25', 350, 299.9);
	testConvert('usaEpa', 'pm25', 450, 424.5);
	testConvert('usaEpa', 'pm25', 550, 550);

	testConvert('usaEpa', 'co', 90, 8.4);
	testConvert('usaEpa', 'o3', 122, 76.9);

	// From https://github.com/hrbonz/python-aqi/blob/master/test/test_epa.py
	testConvert('usaEpa', 'pm25', 39, 9.3);
	testConvert('usaEpa', 'pm25', 57, 15);
	testConvert('usaEpa', 'pm25', 135, 49.5);
	testConvert('usaEpa', 'pm25', 285, 235.4);
	testConvert('usaEpa', 'o3', 155, 87.5); // Note: different from https://github.com/hrbonz/python-aqi/blob/1de807365eb44ef6c4e3d80af500ff8f6c273d41/test/test_epa.py#L34-L45
	// testConvert('usaEpa', 'o3', 147, 0.162); // FIXME Unfortunately We don't track hourly o3 now
	testConvert('usaEpa', 'o3', 238, 141); // Note: different from https://github.com/hrbonz/python-aqi/blob/1de807365eb44ef6c4e3d80af500ff8f6c273d41/test/test_epa.py#L34-L45
	testConvert('usaEpa', 'pm25', 102, 35.9);
	testConvert('usaEpa', 'co', 90, 8.4);

	it('should throw an error on unknown pollutant', () => {
		expect(() => convert('nmhc', 'usaEpa', 'µg/m³', 23)).toThrowError(
			'usaEpa does not apply to pollutant nmhc'
		);
	});

	it('should return the correct range', () => {
		expect(usaEpa.range).toEqual([0, 500]);
	});
});
