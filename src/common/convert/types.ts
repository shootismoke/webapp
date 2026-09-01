import * as aqiCodes from './aqi';
import { Pollutant } from './util/pollutant';

/**
 * An interface to represent an AQI
 */
export interface Aqi {
	displayName: string;
	fromUgm3(pollutant: Pollutant, ugm3: number): number;
	pollutants: Pollutant[];
	range: [number, number];
	toUgm3(pollutant: Pollutant, value: number): number;
}

/**
 * List of AQI codes
 */
export type AqiCode = keyof typeof aqiCodes;
