import { OpenAQResult } from './util';

/**
 * Latitude and longitude object.
 */
export interface LatLng {
	latitude: number;
	longitude: number;
}

interface ArrayOneOrMore<T> extends Array<T> {
	0: T;
}

/**
 * Normalized response from all data providers. We guarantee that normalized
 * results have at least one element, in the openaq-data-format.
 */
export type OpenAQResults = ArrayOneOrMore<OpenAQResult>;
