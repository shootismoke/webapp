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
		const {
			pm25: { value: pm25 },
		} = await universalFetch(user.lastStationId);

		return constructExpoPushMessage(user, pm25);
	} catch (error) {
		throw new Error(`User ${user._id}: ${(error as Error).message}`);
	}
}
