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

import { Model, model, models, Schema } from 'mongoose';
import { v4 } from 'node-uuid';

import { MongoPushTicket } from '../types';

const PushTicketErrorDetailsSchema = new Schema({
	error: {
		enum: [
			'DeviceNotRegistered',
			'InvalidCredentials',
			'MessageTooBig',
			'MessageRateExceeded',
		],
		type: Schema.Types.String,
	},
});

/**
 * @see https://docs.expo.io/versions/latest/guides/push-notifications/#push-ticket-format
 */
const PushTicketSchema = new Schema(
	{
		_id: {
			type: Schema.Types.String,
			default: v4, // eslint-disable-line @typescript-eslint/no-unsafe-assignment
		},
		/**
		 * Error details.
		 */
		details: {
			type: PushTicketErrorDetailsSchema,
		},
		/**
		 * Error message.
		 */
		message: {
			required: function (): boolean {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore Using this syntax from mongoose docs.
				return this.status === 'error';
			},
			type: Schema.Types.String,
		},
		/**
		 * Receipt id, only present with an 'ok' ticket.
		 */
		receiptId: {
			type: Schema.Types.String,
		},
		/**
		 * Ticket status.
		 */
		status: {
			enum: ['ok', 'error'],
			required: true,
			type: Schema.Types.String,
		},
		/**
		 * The user associated to the ticket.
		 */
		userId: {
			ref: 'User',
			required: true,
			type: Schema.Types.String,
		},
	},
	{ strict: 'throw', timestamps: true }
);

// https://stackoverflow.com/questions/19051041/cannot-overwrite-model-once-compiled-mongoose#answer-51351095
export const PushTicket =
	(models.PushTicket as Model<MongoPushTicket>) ||
	model<MongoPushTicket>('PushTicket', PushTicketSchema);
