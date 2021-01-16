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

import { AllProviders } from '@shootismoke/dataproviders';
import { Model, model, models, Schema } from 'mongoose';
import { v4 } from 'node-uuid';
import timezones from 'timezones.json';

import { MongoUser } from '../types';
import { PushTicket } from './pushTicket';

const FREQUENCY = ['never', 'daily', 'weekly', 'monthly'];

const EmailReportSchema = new Schema({
	/**
	 * Email to send the report too.
	 */
	email: {
		required: true,
		sparse: true,
		type: Schema.Types.String,
		unique: true,
		validate: {
			validator: (v: string) => {
				return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v); // eslint-disable-line no-useless-escape
			},
			message: 'Please enter a valid email',
		},
	},
	/**
	 * Frequency of reports.
	 */
	frequency: {
		default: 'never',
		enum: FREQUENCY,
		required: true,
		type: Schema.Types.String,
	},
});

const ExpoReportSchema = new Schema({
	/**
	 * Token to send the push notification to.
	 *
	 * @see https://docs.expo.io/versions/latest/guides/push-notifications/
	 */
	expoPushToken: {
		required: true,
		sparse: true,
		type: Schema.Types.String,
		unique: true,
	},
	/**
	 * Frequency of reports.
	 */
	frequency: {
		default: 'never',
		enum: FREQUENCY,
		required: true,
		type: Schema.Types.String,
	},
});

const UserSchema = new Schema<MongoUser>(
	{
		_id: {
			type: Schema.Types.String,
			default: v4, // eslint-disable-line @typescript-eslint/no-unsafe-assignment
		},
		/**
		 * User's timezone.
		 */
		timezone: {
			enum: timezones.map((tz) => tz.utc).flat(),
			required: true,
			type: Schema.Types.String,
		},
		/**
		 * Station of the user to get the notifications. The value is an universalId,
		 * e.g. `openaq|FR1012` or `aqicn|1047`. For privacy reasons, we do not store
		 * the user's exact lat/lng.
		 */
		lastStationId: {
			// For simplicity sake, we require even if frequency is `never`
			required: true,
			type: Schema.Types.String,
			validate: {
				message: ({ value }): string =>
					`${value as string} is not a valid universalId`,
				validator: (universalId: string): boolean => {
					const [provider, station] = universalId.split('|');

					return !!station && AllProviders.includes(provider);
				},
			},
		},
		/**
		 * User's Expo repots preferences.
		 */
		expoReport: {
			type: ExpoReportSchema,
		},
		/**
		 * User's email repots preferences.
		 */
		emailReport: {
			type: EmailReportSchema,
		},
	},
	{ strict: 'throw', timestamps: true }
);

// eslint-disable-next-line @typescript-eslint/no-misused-promises
UserSchema.pre('remove', async () => {
	const userId = ((this as unknown) as MongoUser)._id;

	// Cascade delete all related PushTickets.
	await PushTicket.remove({ userId }).exec();
});

// https://stackoverflow.com/questions/19051041/cannot-overwrite-model-once-compiled-mongoose#answer-51351095
export const User =
	(models.User as Model<MongoUser>) || model<MongoUser>('User', UserSchema);
