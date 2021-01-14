export const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

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
	timezone: 'America/Los_Angeles',
};

export const bob = {
	emailReport: {
		email: 'bob@example.org',
		frequency: 'daily',
	},
	expoReport: {
		expoPushToken: 'ExponentPushToken[0zK3-xM3PgLEfe31-AafjB]', // real one, unused',
		frequency: 'weekly',
	},
	lastStationId: 'openaq|FR04143',
	timezone: 'America/Los_Angeles',
};
