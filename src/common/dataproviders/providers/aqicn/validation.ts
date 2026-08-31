// Example response
// Object {
//   "data": Object {
//     "aqi": 51,
//     "attributions": Array [
//       Object {
//         "name": "Air Lorraine - Surveillance et étude de la qualité de l'air en Lorraine",
//         "url": "http://air-lorraine.org/",
//       },
//       Object {
//         "name": "European Environment Agency",
//         "url": "http://www.eea.europa.eu/themes/air/",
//       },
//     ],
//     "city": Object {
//       "geo": Array [
//         49.39429190887402,
//         6.201473467510839,
//       ],
//       "name": "Garche, Thionville-Nord",
//       "url": "http://aqicn.org/city/france/lorraine/thionville-nord/garche/",
//     },
//     "dominentpol": "pm25",
//     "iaqi": Object {
//       "no2": Object {
//         "v": 3.2,
//       },
//       "o3": Object {
//         "v": 34.6,
//       },
//       "p": Object {
//         "v": 1012.5,
//       },
//       "pm10": Object {
//         "v": 20,
//       },
//       "pm25": Object {
//         "v": 51,
//       },
//       "so2": Object {
//         "v": 1.6,
//       },
//       "t": Object {
//         "v": 21.6,
//       },
//     },
//     "idx": 7751,
//     "time": Object {
//       "s": "2018-08-09 14:00:00",
//       "tz": "+01:00",
//       "v": 1533823200,
//     },
//   },
//   "status": "ok",
// }

export type AqicnData = {
	attributions?: {
		name?: string;
		url?: string;
	}[];
	city: {
		geo?: [string | number, string | number];
		name?: string;
		url?: string;
	};
	dominentpol?: string;
	iaqi?: {
		[key: string]: {
			v: number;
		};
	};
	idx: number;
	time: {
		s?: string;
		tz?: string;
		v: number;
		iso?: string;
	};
};

export type AqicnResponse = {
	data?: AqicnData | string;
	msg?: string;
	status: 'ok' | 'error' | 'nope';
};
