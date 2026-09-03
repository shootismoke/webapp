/**
 * This file is part of Sh**t! I Smoke.
 *
 * Copyright (C) 2018-2026  Marcelo S. Coelho, Amaury.
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

import { secretHeader } from '../../../../src/backend/util';

/**
 * These specs seed and delete fixtures through /api/users, so they only ever
 * run against a local server -- pointing them at a deployed box would write
 * test users into its database.
 */
export const BACKEND_URL = 'http://localhost:3000';

export const axiosConfig = {
	headers: {
		[secretHeader]: process.env.BACKEND_SECRET,
	},
};

export const alice = {
	emailReport: {
		email: 'alice@example.org',
		frequency: 'daily',
	},
	expoReport: {
		expoPushToken: 'expo_token_alice',
		frequency: 'weekly',
	},
	lastStationId: 'openaq|FR04143',
	timezone: 'Europe/Berlin',
};

export const bob = {
	emailReport: {
		email: 'bob@example.org',
		frequency: 'daily',
	},
	expoReport: {
		expoPushToken: 'ExponentPushToken[0zK3-xM3PgLEfe31-AafjB]', // real one, unused',
		frequency: 'monthly',
	},
	lastStationId: 'openaq|FR04143',
	timezone: 'Europe/Berlin',
};

export const charlie = {
	expoReport: {
		expoPushToken: 'expo_token_charlie',
		frequency: 'daily',
	},
	lastStationId: 'openaq|FR04143',
	timezone: 'Pacific/Apia', // 12h diff with Europe/Berlin
};
