import { Provider } from '../types';
import { AqicnOptions, fetchByGps, fetchByStation } from './fetchBy';
import { normalize } from './normalize';
import { AqicnData } from './validation';

/**
 * @see https://aqicn.org
 */
export const aqicn: Provider<AqicnData, AqicnOptions> = {
	fetchByGps,
	fetchByStation,
	id: 'aqicn',
	name: 'AQI CN',
	normalize,
};
