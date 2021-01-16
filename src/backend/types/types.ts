import { ExpoPushTicket } from 'expo-server-sdk';
import { Document } from 'mongoose';

export interface BackendError {
	error: string;
}

export type Frequency = 'never' | 'daily' | 'weekly' | 'monthly';

export interface IEmailReport {
	email: string;
	frequency: Frequency;
}

export interface IExpoReport {
	expoPushToken: string;
	frequency: Frequency;
}

export interface IUser {
	_id: string;
	emailReport?: IEmailReport;
	expoReport?: IExpoReport;
	lastStationId: string;
	timezone: string;
}

export interface MongoUser extends IUser, Document {
	_id: string;
}

export type IPushTicket = Omit<
	ExpoPushTicket & {
		receiptId?: string;
		userId: string;
	},
	'id'
>;

export interface MongoPushTicket extends IPushTicket, Document {
	_id: string;
}
