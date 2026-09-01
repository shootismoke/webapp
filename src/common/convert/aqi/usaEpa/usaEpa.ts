import { Aqi } from '../../types';
import { Breakpoints, createAqiFromBreakpoints } from '../../util/breakpoints';
import breakpoints from './breakpoints.json';

/**
 * AQI (US)
 * @see https://www3.epa.gov/airnow/aqi-technical-assistance-document-sept2018.pdf
 */
export const usaEpa: Aqi = {
	displayName: 'AQI (US)',
	...createAqiFromBreakpoints('usaEpa', breakpoints as Breakpoints),
};
