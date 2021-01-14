import { model, Schema } from 'mongoose';
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

export const PushTicket = model<MongoPushTicket>(
	'PushTicket',
	PushTicketSchema
);
