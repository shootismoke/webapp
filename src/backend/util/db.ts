import { connect, connection } from 'mongoose';

import { IUser } from '../types';
import { logger } from './logger';

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
}
