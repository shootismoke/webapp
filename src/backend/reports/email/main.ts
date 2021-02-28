/**
 * This file is part of Sh**t! I Smoke.
 *
 * Copyright (C) 2018-2021  Marcelo S. Coelho, Amaury M.
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

import { getCountryFromCode } from '@shootismoke/dataproviders';
import {
	fetchStationId,
	Frequency,
	frequencyToPeriod,
	getAQI,
	getPollutantData,
	getSwearWord,
	MongoUser,
	primaryPollutant,
	round,
} from '@shootismoke/ui';
import debug from 'debug';
import { config } from 'dotenv';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore I'm not sure why we need this line, if @types/form-data is installed
import formData from 'form-data';
import { readFileSync } from 'fs';
import { minify } from 'html-minifier';
import Mailgun from 'mailgun.js';
import { render } from 'mustache';

import { t } from '../../../frontend/localization';
import {
	City,
	getAllCities,
	rankClosestCities,
} from '../../../frontend/util/cities';
import { connectToDatabase } from '../../util';
import { findUsersForReport } from '../cron';
import { getMessageBody as getExpoMessage } from '../expo/expo';
import { tips } from './tips';

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
	frequency: Frequency,
	swearWord: string
): string {
	if (frequency === 'daily') {
		return `🚬 ${swearWord}! You'll smoke ${round(
			dailyCigarettes
		)} cigarettes today`;
	}

	return `🚬 ${swearWord}! You smoke ${getDisplayedCigarettes(
		dailyCigarettes,
		frequency
	)} cigarettes every ${frequencyToPeriod(frequency)}`;
}

/**
 * Craft an email for a user.
 *
 * @param user - The user to send the email to.
 */
async function emailForUser(
	user: MongoUser,
	cities: City[]
): Promise<CreateMessageOpts> {
	if (!user.emailReport) {
		throw new Error(
			`User ${user._id} has emailReport field per our query. qed.`
		);
	}

	const template = readFileSync(
		'./src/backend/reports/email/template.html'
	).toString('utf-8');

	const api = await fetchStationId(user.lastStationId);

	const cigarettes = getDisplayedCigarettes(
		api.shootismoke.dailyCigarettes,
		user.emailReport.frequency
	);
	const primaryPol = primaryPollutant(api.results) || api.results[0]; // We fallback to first value. FIXME.
	const aqi = getAQI(api.results) || api.results[0].value; // We fallback to first value. FIXME.
	const polData = getPollutantData(primaryPol.parameter);
	const swearWord = t(getSwearWord(cigarettes));
	const closestCities = (api.pm25.coordinates
		? rankClosestCities(cities, api.pm25.coordinates, 5)
		: cities.slice(0, 5)
	).map((city) => ({
		cigarettes: city.api?.shootismoke.dailyCigarettes
			? `${getDisplayedCigarettes(
					city.api.shootismoke.dailyCigarettes,
					user.emailReport?.frequency || 'daily'
			  )} cigarettes`
			: '0 cigarette',
		name: city.name
			? [city.name, city.adminName, city.country]
					.filter((x) => !!x)
					.join(', ')
			: 'Unknown City',
	}));

	// Render template with mustache.
	const mustacheData = {
		closestCities,
		cigarettes,
		frequency: user.emailReport.frequency,
		frequencyPeriod: frequencyToPeriod(user.emailReport.frequency),
		location:
			[
				api.pm25.city,
				getCountryFromCode(api.pm25.country) || api.pm25.country,
			]
				.filter((x) => !!x)
				.join(', ') ||
			api.pm25.location ||
			api.pm25.sourceName ||
			'Unknown City',
		pollutant: `${polData.name} (${primaryPol.parameter.toUpperCase()})`,
		swearWord,
		tips: tips(aqi),
		userId: user._id,
	};
	// We render the HTML using the mustach template and the data above. We
	// also minify the rendered HTML, so that it doesn't get bigger than 102KB.
	// https://mailchimp.com/help/gmail-is-clipping-my-email/
	const html = minify(render(template, mustacheData), {
		collapseBooleanAttributes: true,
		collapseInlineTagWhitespace: true,
		decodeEntities: true,
		minifyCSS: true,
		removeComments: true,
		removeAttributeQuotes: true,
		removeEmptyAttributes: true,
		removeEmptyElements: true,
		removeOptionalTags: true,
		removeRedundantAttributes: true,
		removeScriptTypeAttributes: true,
		removeStyleLinkTypeAttributes: true,
		removeTagWhitespace: true,
	});

	return {
		from: 'Marcelo <marcelo@shootismoke.app>',
		html,
		subject: getEmailSubject(
			api.shootismoke.dailyCigarettes,
			user.emailReport.frequency,
			swearWord
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
	// users.push({
	// 	_id: 'foo',
	// 	lastStationId: 'aqicn|3092',
	// 	emailReport: {
	// 		email: 'amaury@shootismoke.app',
	// 		frequency: 'weekly',
	// 	},
	// 	timezone: 'Europe/Berlin',
	// });

	const cities = await getAllCities();

	// TODO: To not spam OpenAQ, WAQI and Mailgun servers too hard at once,
	// should we spread the requests a little bit (by chunks, or with a simple
	// queue)?
	const emails = await Promise.allSettled(
		users.map(async (user) => {
			const email = await emailForUser(user, cities);

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
