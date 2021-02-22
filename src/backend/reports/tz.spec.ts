/**
 * This file is part of Sh**t! I Smoke.
 *
 * Copyright (C) 2018-2021  Marcelo S. Coelho, Amaury M.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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
