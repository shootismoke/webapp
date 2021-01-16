/**
 * This file is part of Sh**t! I Smoke.
 *
 * Copyright (C) 2018-2021  Marcelo S. Coelho, Amaury Martiny.
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

import debug from 'debug';
import { connect, connection } from 'mongoose';

import { IUser } from '../types';
import { logger } from './logger';

const l = debug('shootismoke:db');

/**
 * Assert that we have a user.
 */
export function assertUser(
	user: IUser | null,
	userId: string
): asserts user is IUser {
	if (!user) {
		const e = new Error(`No user with userId "${userId}" found`);
		logger.error(e);
		throw e;
	}
}

/**
 * A function for connecting to MongoDB.
 */
export async function connectToDatabase(): Promise<void> {
	// If there's already a connection, we do nothing
	if (connection.readyState === 1) {
		l('Already connected to db.');
		return;
	}

	if (!process.env.BACKEND_MONGODB_ATLAS_URI) {
		const e = new Error(
			'connectToDatabase: `BACKEND_MONGODB_ATLAS_URI` is not defined'
		);
		logger.error(e);
		throw e;
	}

	await connect(process.env.BACKEND_MONGODB_ATLAS_URI, {
		useCreateIndex: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	l('Connected to db.');
}
