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
