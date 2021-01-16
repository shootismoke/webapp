import { config } from 'dotenv';
//eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { client, CreateMessageOpts } from 'mailgun.js';

import { IUser } from '../../types';
import { findUsersForReport } from '../cron';
import { universalFetch } from '../provider';

config({ path: '.env.staging' });

if (
	!process.env.BACKEND_MAILGUN_API_KEY ||
	!process.env.BACKEND_MAILGUN_DOMAIN
) {
	throw new Error(
		'Environment variables BACKEND_MAILGUN_{DOMAIN, API_KEY} need to be set'
	);
}

const mg = client({
	username: 'api',
	key: process.env.BACKEND_MAILGUN_API_KEY,
});

/**
 * Craft an email for a user.
 *
 * @param user - The user to send the email to.
 */
async function emailForUser(user: IUser): Promise<CreateMessageOpts> {
	if (!user.emailReport) {
		throw new Error(
			`User ${user._id} has emailReport field per our query. qed.`
		);
	}

	const api = await universalFetch(user.lastStationId);

	return {
		from: 'hi@shootismoke.app',
		html: '<h1>Testing some Mailgun awesomness!</h1>',
		subject: `You smoke ${api.shootismoke.dailyCigarettes} cigarettes `,
		text: 'this is from the text field',
		to: user.emailReport.email,
	};
}

export async function main(): Promise<void> {
	// Fetch all users to whom we should send an email report.
	const users = await findUsersForReport('email');

	const emails = await Promise.allSettled(
		users.map(async (user) => {
			const email = await emailForUser(user);

			return mg.messages.create(
				process.env.BACKEND_MAILGUN_DOMAIN as string,
				email
			);
		})
	);

	const successful = emails.filter((p) => p.status === 'fulfilled');

	console.log(`Sent ${successful.length}/${users.length} successful emails.`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
