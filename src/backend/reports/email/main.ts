import debug from 'debug';
import { config } from 'dotenv';
//eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { client, CreateMessageOpts } from 'mailgun.js';

import { IUser } from '../../types';
import { connectToDatabase } from '../../util';
import { findUsersForReport } from '../cron';
import { universalFetch } from '../provider';

config({ path: '.env.staging' });

const l = debug('shootismoke:emailReport');

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

	console.log({
		from: 'Marcelo from Sh**t! I Smoke <hi@shootismoke.app>',
		subject: `You smoke ${api.shootismoke.dailyCigarettes} cigarettes `,
		text: 'this is from the text field',
		to: user.emailReport.email,
	});

	return {
		from: 'hi@shootismoke.app',
		html: '<h1>Testing some Mailgun awesomness!</h1>',
		subject: `You smoke ${api.shootismoke.dailyCigarettes} cigarettes `,
		text: 'this is from the text field',
		to: user.emailReport.email,
	};
}

/**
 * Main entry point of the script to send email reports to all users.
 */
export async function main(): Promise<void> {
	l('Starting email report script.');
	await connectToDatabase();
	// Fetch all users to whom we should send an email report.
	const users = await findUsersForReport('email');
	l('Found %d users to send emails to.', users.length);

	// TODO: To not spam OpenAQ, WAQI and Mailgun servers too hard at once,
	// should we spread the requests a little bit (by chunks, or with a simple
	// queue)?
	const emails = await Promise.allSettled(
		users.map(async (user) => {
			const email = await emailForUser(user);

			return mg.messages.create(
				process.env.BACKEND_MAILGUN_DOMAIN as string,
				email
			);
		})
	);

	const rejected = emails.filter((p) => p.status === 'rejected');
	if (rejected.length) {
		l(`${rejected.length}/${users.length} rejected:`);
		l(rejected);
	}

	const successful = emails.filter((p) => p.status === 'fulfilled');
	l(`Sent ${successful.length}/${users.length} successful emails.`);
}
