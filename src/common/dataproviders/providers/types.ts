import type { LatLng, OpenAQResults } from '../types';

/**
 * An interface representing an air quality data provider.
 */
export interface Provider<Response, Options> {
	fetchByGps(gps: LatLng, options?: Options): Promise<Response>;
	fetchByStation(stationId: string, options?: Options): Promise<Response>;
	id: string;
	name: string;
	normalize: (d: Response) => OpenAQResults;
}
