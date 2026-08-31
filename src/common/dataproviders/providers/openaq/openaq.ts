import { Provider } from '../types';
import { fetchByGps, fetchByStation, OpenAQOptions } from './fetchBy';
import { normalize } from './normalize';
import { OpenAQMeasurements } from './types';

export const openaq: Provider<OpenAQMeasurements, OpenAQOptions> = {
	fetchByGps,
	fetchByStation,
	id: 'openaq',
	name: 'Open AQ',
	normalize,
};
