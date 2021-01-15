import { findTimezonesAt } from './tz';

describe('findTimezonesAt', () => {
	it('should work correctly ', () => {
		expect(
			findTimezonesAt(2, new Date('2020-02-12T01:27:21.771Z'))
		).toEqual([
			'Arctic/Longyearbyen',
			'Europe/Amsterdam',
			'Europe/Andorra',
			'Europe/Berlin',
			'Europe/Busingen',
			'Europe/Gibraltar',
			'Europe/Luxembourg',
			'Europe/Malta',
			'Europe/Monaco',
			'Europe/Oslo',
			'Europe/Rome',
			'Europe/San_Marino',
			'Europe/Stockholm',
			'Europe/Vaduz',
			'Europe/Vatican',
			'Europe/Vienna',
			'Europe/Zurich',
			'Europe/Belgrade',
			'Europe/Bratislava',
			'Europe/Budapest',
			'Europe/Ljubljana',
			'Europe/Podgorica',
			'Europe/Prague',
			'Europe/Tirane',
			'Africa/Ceuta',
			'Europe/Brussels',
			'Europe/Copenhagen',
			'Europe/Madrid',
			'Europe/Paris',
			'Europe/Sarajevo',
			'Europe/Skopje',
			'Europe/Warsaw',
			'Europe/Zagreb',
			'Africa/Algiers',
			'Africa/Bangui',
			'Africa/Brazzaville',
			'Africa/Douala',
			'Africa/Kinshasa',
			'Africa/Lagos',
			'Africa/Libreville',
			'Africa/Luanda',
			'Africa/Malabo',
			'Africa/Ndjamena',
			'Africa/Niamey',
			'Africa/Porto-Novo',
			'Africa/Tunis',
			'Etc/GMT-1',
			'Africa/Windhoek',
		]);
	});

	it('should work correctly', () => {
		expect(
			findTimezonesAt(23, new Date('2020-08-12T01:27:21.771Z'))
		).toEqual(['America/Noronha', 'Atlantic/South_Georgia', 'Etc/GMT+2']);
	});
});
