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

import type { Frequency } from '@shootismoke/ui/lib/context/Frequency';
import { round } from '@shootismoke/ui/lib/util/api';
import debug from 'debug';
import { config } from 'dotenv';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore I'm not sure why we need this line, if @types/form-data is installed
import formData from 'form-data';
import { readFileSync } from 'fs';
import Mailgun from 'mailgun.js';
import { render } from 'mustache';

import { getSwearWord } from '../../../frontend/util/cigarettes';
import { IUser } from '../../types';
import { connectToDatabase } from '../../util';
import { findUsersForReport } from '../cron';
import { getMessageBody as getExpoMessage } from '../expo/expo';
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

const mg = new Mailgun(formData);
const mgClient = mg.client({
	username: 'api',
	key: process.env.BACKEND_MAILGUN_API_KEY,
});

interface CreateMessageOpts {
	from: string;
	to: string;
	subject: string;
	text: string;
	html: string;
	'o:tag'?: string[];
}

/**
 * Depending on the user's frequency, calculate the number of cigarettes to
 * display.
 *
 * @param api - The Api object.
 * @param frequency - The user's frequency.
 */
function getDisplayedCigarettes(
	dailyCigarettes: number,
	frequency: Frequency
): number {
	return round(
		frequency === 'monthly'
			? dailyCigarettes * 30
			: frequency === 'weekly'
			? dailyCigarettes * 7
			: dailyCigarettes
	);
}

/**
 * Generate the body of the push notification message.
 */
function getEmailSubject(
	dailyCigarettes: number,
	frequency: Frequency
): string {
	if (frequency === 'daily') {
		return `🚬 Shoot! You'll smoke ${round(
			dailyCigarettes
		)} cigarettes today`;
	}

	return `🚬 Shoot! You smoke ${getDisplayedCigarettes(
		dailyCigarettes,
		frequency
	)} cigarettes every ${frequency === 'monthly' ? 'month' : 'week'}.`;
}

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

	const template = readFileSync(
		'./src/backend/reports/email/template.html'
	).toString('utf-8');

	const api = await universalFetch(user.lastStationId);
	const cigarettes = getDisplayedCigarettes(
		api.shootismoke.dailyCigarettes,
		user.emailReport.frequency
	);
	const mustacheData = {
		cigarettes,
		frequency:
			user.emailReport.frequency === 'daily'
				? 'day'
				: user.emailReport.frequency === 'weekly'
				? 'week'
				: 'month',
		swearWord: getSwearWord(cigarettes),
	};

	const html = render(template, mustacheData);

	return {
		from: 'Marcelo <marcelo@shootismoke.app>',
		html,
		subject: getEmailSubject(
			api.shootismoke.dailyCigarettes,
			user.emailReport.frequency
		),
		// Fallback to the same message as the Expo push notification.
		text: getExpoMessage(
			api.shootismoke.dailyCigarettes,
			user.emailReport.frequency
		),
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

	// If you wish to test, uncomment the following lines and fill out your
	// info.
	users.push({
		_id: 'foo',
		lastStationId: 'aqicn|1425',
		emailReport: {
			email: 'amaury@shootismoke.app',
			frequency: 'weekly',
		},
		timezone: 'Europe/Berlin',
	});

	// TODO: To not spam OpenAQ, WAQI and Mailgun servers too hard at once,
	// should we spread the requests a little bit (by chunks, or with a simple
	// queue)?
	const emails = await Promise.allSettled(
		users.map(async (user) => {
			const email = await emailForUser(user);

			return mgClient.messages.create(
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
