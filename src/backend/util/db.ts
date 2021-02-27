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

import type { IUser } from '@shootismoke/ui';
import debug from 'debug';
import createHttpError from 'http-errors';
import { connect, connection } from 'mongoose';

const l = debug('shootismoke:db');

/**
 * Assert that we have a user.
 */
export function assertUser(
	user: IUser | null,
	id: string
): asserts user is IUser {
	if (!user) {
		throw createHttpError(404, `No user with "${id}" found`);
	}
}

/**
 * A function for connecting to MongoDB.
 */
export async function connectToDatabase(): Promise<void> {
	// If there's already a connection, we do nothing
	if (connection.readyState >= 1) {
		l('Already connected to db.');

		return;
	}

	if (!process.env.BACKEND_MONGODB_ATLAS_URI) {
		throw createHttpError(
			500,
			'connectToDatabase: `BACKEND_MONGODB_ATLAS_URI` is not defined'
		);
	}

	await connect(process.env.BACKEND_MONGODB_ATLAS_URI, {
		useCreateIndex: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	l('Connected to db.');
}
