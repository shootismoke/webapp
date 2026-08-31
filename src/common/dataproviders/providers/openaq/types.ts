import type { OpenAQResult } from '../../util';

/**
 * Return type for the /v2/measurements endpoint.
 *
 * @see https://docs.openaq.org/#/v2/measurements_get_v2_measurements_get
 */
export type OpenAQMeasurements = {
	meta: {
		found: number;
		license: string;
		limit: number;
		name: string;
		page: number;
		website: string;
	};
	results: OpenAQResult[];
};
