import axios from 'axios';

import { IUser } from '../types';
import { IS_PROD } from './constants';

const EASYCRON_API = 'https://www.easycron.com/rest/';

/**
 * Whitelist an endpoint to only IP addresses from easycron.com.
 *
 * @see https://www.easycron.com/ips
 */
const whitelist = [
	'192.99.21.124',
	'167.114.64.88',
	'167.114.64.21',
	'198.27.83.222',
	'2607:5300:60:24de::',
	'2607:5300:60:467c::',
	'2607:5300:60:6558::',
	'2607:5300:60:6515::',
];

/**
 * Check that the request comes form a whitelisted IP address.
 */
export function isWhitelisted(ip: string): boolean {
	return !IS_PROD || whitelist.includes(ip);
}

/**
 * Send an API request to easycron to schedule notifications for a user.
 *
 * @param user - The user to add a cron job for.
 */
export function addCronJob(user: IUser): Promise<void> {
	return axios.get(
		`${EASYCRON_API}/add?token=${
			process.env.BACKEND_EASYCRON_API_TOKEN || ''
		}&name=value`
	);
}
