// Sh**t! I Smoke
// Copyright (C) 2018-2026  Marcelo S. Coelho, Amaury.

// Sh**t! I Smoke is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Sh**t! I Smoke is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Sh**t! I Smoke.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Types for the OpenAQ v3 API.
 *
 * v1 and v2 were retired in 2025 (they return HTTP 410), and v3 dropped the
 * single `/measurements?coordinates=` endpoint entirely. Readings are now
 * reached in two steps: find locations near a point, then ask one of them for
 * its latest values.
 *
 * @see https://api.openaq.org/openapi.json
 */

export interface OpenAQDatetime {
	utc: string;
	local: string;
}

export interface OpenAQCoordinates {
	latitude: number | null;
	longitude: number | null;
}

export interface OpenAQParameterBase {
	id: number;
	name: string;
	units: string;
	displayName: string | null;
}

export interface OpenAQSensorBase {
	id: number;
	name: string;
	parameter: OpenAQParameterBase;
}

export interface OpenAQLocation {
	id: number;
	name: string | null;
	locality: string | null;
	timezone: string;
	country: { id: number | null; code: string; name: string };
	provider: { id: number; name: string };
	isMobile: boolean;
	isMonitor: boolean;
	sensors: OpenAQSensorBase[];
	coordinates: OpenAQCoordinates;
	distance: number | null;
	datetimeLast: OpenAQDatetime | null;
}

export interface OpenAQLocationsResponse {
	results: OpenAQLocation[];
}

/** One reading, as returned by `/v3/locations/{id}/latest`. */
export interface OpenAQLatest {
	datetime: OpenAQDatetime;
	value: number;
	coordinates: OpenAQCoordinates;
	sensorsId: number;
	locationsId: number;
}

export interface OpenAQLatestResponse {
	results: OpenAQLatest[];
}

/**
 * What `fetchByGps`/`fetchByStation` hand to `normalize`: a location plus the
 * latest reading from whichever of its sensors we asked for.
 */
export interface OpenAQMeasurements {
	location: OpenAQLocation;
	sensor: OpenAQSensorBase;
	latest: OpenAQLatest;
}
