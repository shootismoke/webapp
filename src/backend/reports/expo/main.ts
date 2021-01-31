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

import { ExpoPushMessage } from 'expo-server-sdk';

import { IUser } from '../../types';
import { universalFetch } from '../provider';
import { constructExpoPushMessage } from './expo';

/**
 * Generate the correct expo push notification message for our user.
 *
 * @param user - User in our DB.
 */
export async function expoPushMessageForUser(
	user: IUser
): Promise<ExpoPushMessage> {
	try {
		const api = await universalFetch(user.lastStationId);

		return constructExpoPushMessage(user, api.shootismoke.dailyCigarettes);
	} catch (error) {
		throw new Error(`User ${user._id}: ${(error as Error).message}`);
	}
}
