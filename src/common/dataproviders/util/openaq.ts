import { Pollutant, Unit } from '@common/convert';

type attributions = {
	name: string;
	url?: string | undefined;
}[];

type latLng = {
	latitude: number;
	longitude: number;
};

type entity = 'community' | 'government' | 'research' | 'other';

/**
 * A TypeScript type to represent the OpenAQ data format.
 *
 * This is empirical! It is gathered from looking at multiple endpoints.
 * @see https://github.com/openaq/openaq-data-format
 *
 *
 */
export interface OpenAQResult {
	parameter: Pollutant;
	unit: Unit;
	country: string;
	date: {
		local: string;
		utc: string;
	};
	location: string;
	value: number;
	attribution?: attributions;
	averagingPeriod?: { unit: string; value?: number };
	city?: string;
	coordinates?: latLng;
	entity?: entity;
	isAnalysis?: boolean;
	isMobile?: boolean;
	sourceName?: string;
	sensorType?: string;
}

/**
 * @ignore
 */
export type OpenAQErrorObject = {
	detail: {
		loc: string[];
		msg: string;
		type: string;
	}[];
};

/**
 * Type of the v2 OpenAQ error format.
 * We sometimes (rarely) get a string.
 */
export type OpenAQError =
	| string
	| {
			detail: {
				loc: string[];
				msg: string;
				type: string;
			}[];
	  };
