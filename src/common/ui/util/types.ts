/**
 * This file is part of Sh**t! I Smoke.
 *
 * Copyright (C) 2018-2026  Marcelo S. Coelho, Amaury.
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

export type Frequency = 'never' | 'daily' | 'weekly' | 'monthly';

export interface BackendError {
	error: string;
}

export interface IEmailReport {
	email: string;
	frequency: Frequency;
}

export interface IExpoReport {
	expoPushToken: string;
	frequency: Frequency;
}

export interface IUser {
	/** `null` rather than absent when the user has no email subscription. */
	emailReport: IEmailReport | null;
	/** `null` rather than absent when the user has no push subscription. */
	expoReport: IExpoReport | null;
	lastStationId: string;
	timezone: string;
}

/**
 * A user as `/api/users` stores and returns it.
 *
 * `_id` keeps its underscore, and the timestamps are ISO 8601 strings rather
 * than dates, because the mobile app reads both straight off the response.
 * Renaming either is a breaking API change, not a rename.
 */
export interface DbUser extends IUser {
	_id: string;
	createdAt: string;
	updatedAt: string;
}
