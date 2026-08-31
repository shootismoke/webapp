import { Provider } from '../types';
import { fetchByGps } from './fetchBy';
import { normalize } from './normalize';
import { WaqiResponse } from './types';

/**
 * @see https://wind.waqi.info/
 */
export const waqi: Provider<WaqiResponse, unknown> = {
	fetchByGps,
	fetchByStation: () => Promise.reject(new Error('Not implemented')),
	id: 'waqi',
	name: 'WAQI',
	normalize,
};
