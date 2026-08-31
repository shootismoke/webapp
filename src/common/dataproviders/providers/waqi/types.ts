// Example response:
// Object {
//   "d": Array [
//     Object {
//       "d": 0.8,
//       "geo": Array [
//         52.489451,
//         13.430844,
//       ],
//       "key": "_c08tyk3Mq9R3Si3KyczT90stzT68LScnT9cvMa84Na-4pCjx8PxUAA",
//       "nlo": "Neukölln-Nansenstraße, Berlin",
//       "nna": "",
//       "pol": "pm25",
//       "t": 1533819600,
//       "u": "Germany/Berlin/Neukölln-Nansenstraße",
//       "v": "75",
//       "x": "10032",
//     },
//   ],
//   "g": null,
// }

export type WaqiResponse = {
	d: {
		d: number;
		geo: [number, number];
		key: string;
		nlo: string;
		nna: string;
		pol: string;
		t: number;
		u: string;
		v: string;
		x: string;
	}[];
	g: unknown;
};
