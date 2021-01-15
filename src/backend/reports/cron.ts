/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { PushTicket, User } from '../models';
import { Frequency, IUser } from '../types';
import { findTimezonesAt } from './tz';

/**
 * Show reports at these hours of the day.
 */
const REPORT_HOUR = {
	daily: 9,
	weekly: 21,
	monthly: 21,
};

/**
 * Based on the time now and the frequency of reports, find the timezones
 * that should receive a reports now.
 *
 * @param frequency - The frequency of reports.
 * @param now - The time now.
 */
function getTimezones(frequency: Frequency, now: Date): string[] {
	let timezones: string[] = [];
	if (frequency === 'daily') {
		timezones = findTimezonesAt(REPORT_HOUR.daily, now);
	} else if (frequency === 'weekly' && now.getUTCDay() === 0) {
		// Show weekly reports on Sundays
		timezones = findTimezonesAt(REPORT_HOUR.weekly, now);
	} else if (frequency === 'monthly' && now.getUTCDate() === 1) {
		// Show monthly reports on the 1st of the month
		timezones = findTimezonesAt(REPORT_HOUR.monthly, now);
	}

	return timezones;
}

/**
 * Generate the mongodb users aggregation pipeline for finding users to send
 * reports to.
 */
function usersPipeline(
	frequency: Frequency,
	report: 'email' | 'expo',
	now: Date
): any[] {
	const timezones = getTimezones(frequency, now);

	const pipeline: any[] = [
		// Get all users matching frequency and timezone.
		{
			$match: {
				[`${report}Report`]: frequency,
				timezone: {
					$in: timezones,
				},
			},
		},
	];
	// Check if user has any active pushTickets from Expo.
	if (report === 'expo') {
		pipeline.push(
			{
				$lookup: {
					as: 'pushTickets',
					from: PushTicket.collection.name,
					localField: '_id',
					foreignField: 'userId',
				},
			},
			// Only return users with no puchTickets.
			{
				$match: {
					pushTickets: { $size: 0 },
				},
			}
		);
	}

	return pipeline;
}

/**
 * Find in DB all users to show reports with frequency `frequency`.
 *
 * @param frequency - The frequency to show the timezones.
 * @param now - The time now, can be set to arbitrary time (e.g. for testing
 * purposes).
 * @todo Unpure.
 */
export async function findUsersForReport(
	report: 'email' | 'expo',
	now = new Date()
): Promise<IUser[]> {
	// Return a tuple [dailyUsers, weeklyUsers, monthlyUsers]
	const allUsers = await Promise.all(
		(['daily', 'weekly', 'monthly'] as const).map((frequency) =>
			User.aggregate<IUser>(usersPipeline(frequency, report, now))
		)
	);

	return allUsers.flat();
}
