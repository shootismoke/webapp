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

import type { DbUser, Frequency, IEmailReport, IExpoReport } from '@common/ui';
import createHttpError from 'http-errors';
import { randomUUID } from 'node:crypto';
import timezones from 'timezones.json';

import { getDb } from '../util/db';

const FREQUENCY = ['never', 'daily', 'weekly', 'monthly'];

/**
 * The providers a `universalId` may refer to.
 *
 * `@shootismoke/dataproviders` used to export this as `AllProviders`; as of
 * 0.10.0 the list lives inside `@shootismoke/ui`'s `fetchStationId` and is no
 * longer exported, so we mirror it here. Keep it in sync with that function:
 * anything it can fetch, this model has to accept.
 */
const ALL_PROVIDERS = ['aqicn', 'openaq', 'waqi'];

const TIMEZONES = new Set(timezones.map((tz) => tz.utc).flat());

// eslint-disable-next-line no-useless-escape
const EMAIL_RE = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

/**
 * The fields a request body may set, and nothing else.
 *
 * An unknown field is a 400 rather than something quietly dropped: a client
 * that misspells `lastStationId` should hear about it, not get a 200 and
 * wonder why the setting never sticks.
 */
const USER_FIELDS = [
	'_id',
	'timezone',
	'lastStationId',
	'emailReport',
	'expoReport',
	// Tolerated but never honoured: a client that PATCHes back a whole user
	// object it previously read should not trip the check above. The server
	// owns both values.
	'createdAt',
	'updatedAt',
];
const EMAIL_REPORT_FIELDS = ['email', 'frequency'];
const EXPO_REPORT_FIELDS = ['expoPushToken', 'frequency'];

/**
 * A row as SQLite stores it: the two report subdocuments flattened into
 * columns. See the schema in `../util/db` for why they are not JSON.
 */
interface UserRow {
	_id: string;
	timezone: string;
	lastStationId: string;
	emailReportEmail: string | null;
	emailReportFrequency: string | null;
	expoReportExpoPushToken: string | null;
	expoReportFrequency: string | null;
	createdAt: string;
	updatedAt: string;
}

/**
 * A user as a request body describes it, before validation.
 */
interface UserInput {
	_id?: unknown;
	timezone?: unknown;
	lastStationId?: unknown;
	emailReport?: unknown;
	expoReport?: unknown;
}

/** One validation failure: which field, and what is wrong with it. */
interface FieldError {
	path: string;
	message: string;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * `null`, `undefined` and `''` all count as absent for a required field.
 */
function isMissing(value: unknown): boolean {
	return value === undefined || value === null || value === '';
}

function assertNoUnknownFields(
	body: Record<string, unknown>,
	allowed: string[],
	prefix: string
): void {
	for (const key of Object.keys(body)) {
		if (!allowed.includes(key)) {
			throw createHttpError(
				400,
				`Field \`${prefix}${key}\` is not in schema and strict mode is set to throw.`
			);
		}
	}
}

function requiredError(path: string, field: string): FieldError {
	return { path, message: `Path \`${field}\` is required.` };
}

function enumError(path: string, field: string, value: unknown): FieldError {
	return {
		path,
		message: `\`${String(
			value
		)}\` is not a valid enum value for path \`${field}\`.`,
	};
}

/**
 * Validate one of the two subscriptions and normalise it.
 *
 * `frequency` defaults to `never`, so a PATCH that introduces a subscription
 * without naming one still produces a complete row rather than a half-filled
 * pair of columns.
 */
function validateReport(
	value: unknown,
	prefix: 'emailReport' | 'expoReport',
	tokenField: 'email' | 'expoPushToken',
	errors: FieldError[]
): { token: string; frequency: Frequency } | null {
	const before = errors.length;

	if (isMissing(value)) {
		return null;
	}

	if (!isPlainObject(value)) {
		errors.push({
			path: prefix,
			message: `Cast to ${prefix} failed for value ${JSON.stringify(
				value
			)}`,
		});

		return null;
	}

	assertNoUnknownFields(
		value,
		prefix === 'emailReport' ? EMAIL_REPORT_FIELDS : EXPO_REPORT_FIELDS,
		`${prefix}.`
	);

	const token = value[tokenField];
	const frequency = value.frequency === undefined ? 'never' : value.frequency;

	if (isMissing(token)) {
		errors.push(requiredError(`${prefix}.${tokenField}`, tokenField));
	} else if (typeof token !== 'string') {
		errors.push(requiredError(`${prefix}.${tokenField}`, tokenField));
	} else if (tokenField === 'email' && !EMAIL_RE.test(token)) {
		errors.push({
			path: `${prefix}.email`,
			message: 'Please enter a valid email',
		});
	}

	if (typeof frequency !== 'string' || !FREQUENCY.includes(frequency)) {
		errors.push(enumError(`${prefix}.frequency`, 'frequency', frequency));
	}

	if (errors.length > before) {
		return null;
	}

	return {
		token: token as string,
		frequency: frequency as Frequency,
	};
}

/**
 * Validate a whole user, collecting every problem before throwing, so one
 * request reports all of its bad fields rather than the first.
 *
 * The 400 body reads `User validation failed: <path>: <reason>`, one clause
 * per field. That string is part of the API contract: the mobile app shows it
 * to the user verbatim when a subscription fails to save. Reword a reason if
 * it is wrong, but leave the shape -- including the trailing periods -- alone.
 */
function validate(input: UserInput): UserRow {
	assertNoUnknownFields(input as Record<string, unknown>, USER_FIELDS, '');

	const errors: FieldError[] = [];

	const { timezone, lastStationId } = input;

	if (isMissing(timezone)) {
		errors.push(requiredError('timezone', 'timezone'));
	} else if (typeof timezone !== 'string' || !TIMEZONES.has(timezone)) {
		errors.push(enumError('timezone', 'timezone', timezone));
	}

	if (isMissing(lastStationId)) {
		errors.push(requiredError('lastStationId', 'lastStationId'));
	} else if (typeof lastStationId !== 'string') {
		errors.push({
			path: 'lastStationId',
			message: `${String(lastStationId)} is not a valid universalId`,
		});
	} else {
		const [provider, station] = lastStationId.split('|');

		if (!station || !ALL_PROVIDERS.includes(provider)) {
			errors.push({
				path: 'lastStationId',
				message: `${lastStationId} is not a valid universalId`,
			});
		}
	}

	const emailReport = validateReport(
		input.emailReport,
		'emailReport',
		'email',
		errors
	);
	const expoReport = validateReport(
		input.expoReport,
		'expoReport',
		'expoPushToken',
		errors
	);

	if (errors.length) {
		throw createHttpError(
			400,
			`User validation failed: ${errors
				.map(({ path, message }) => `${path}: ${message}`)
				.join(', ')}`
		);
	}

	const now = new Date().toISOString();

	return {
		_id: typeof input._id === 'string' ? input._id : randomUUID(),
		timezone: timezone as string,
		lastStationId: lastStationId as string,
		emailReportEmail: emailReport?.token ?? null,
		emailReportFrequency: emailReport?.frequency ?? null,
		expoReportExpoPushToken: expoReport?.token ?? null,
		expoReportFrequency: expoReport?.frequency ?? null,
		createdAt: now,
		updatedAt: now,
	};
}

/**
 * Turn a row back into the nested document the API has always returned.
 *
 * Absent reports come back as `null` rather than being omitted, so a client
 * can tell "no email subscription" from "field I forgot to read".
 */
function toUser(row: UserRow): DbUser {
	const emailReport: IEmailReport | null = row.emailReportEmail
		? {
				email: row.emailReportEmail,
				frequency: row.emailReportFrequency as Frequency,
		  }
		: null;

	const expoReport: IExpoReport | null = row.expoReportExpoPushToken
		? {
				expoPushToken: row.expoReportExpoPushToken,
				frequency: row.expoReportFrequency as Frequency,
		  }
		: null;

	return {
		_id: row._id,
		timezone: row.timezone,
		lastStationId: row.lastStationId,
		emailReport,
		expoReport,
		createdAt: row.createdAt,
		updatedAt: row.updatedAt,
	};
}

/**
 * Flatten a stored user back into the shape `validate` accepts, so a PATCH can
 * be merged onto it and revalidated as a whole.
 */
function toInput(user: DbUser): UserInput {
	return {
		_id: user._id,
		timezone: user.timezone,
		lastStationId: user.lastStationId,
		emailReport: user.emailReport,
		expoReport: user.expoReport,
	};
}

/**
 * Merge a PATCH body onto an existing user.
 *
 * Only the two report subdocuments nest, so one level of merging is all this
 * needs -- `{ emailReport: { frequency: 'monthly' } }` keeps the address.
 * Anything that is not a plain object replaces outright, which is how
 * `{ expoReport: null }` unsubscribes.
 */
function mergePatch(
	current: UserInput,
	patch: Record<string, unknown>
): UserInput {
	assertNoUnknownFields(patch, USER_FIELDS, '');

	const merged: Record<string, unknown> = { ...current };

	for (const [key, value] of Object.entries(patch)) {
		const existing = merged[key];

		merged[key] =
			isPlainObject(value) && isPlainObject(existing)
				? { ...existing, ...value }
				: value;
	}

	return merged as UserInput;
}

/**
 * Turn a unique-index violation into a 400 naming the field that caused it.
 *
 * Without this the caller gets a 500 and a message about a column, for what is
 * really "that address is already subscribed" -- a client error, and one the
 * mobile app can act on.
 *
 * SQLite names the offending *column* -- "UNIQUE constraint failed:
 * users.expoReportExpoPushToken" -- not the index, so match on that. A row
 * that collides on both at once is reported against whichever SQLite hits
 * first.
 */
function rethrowConstraint(err: unknown, user: UserRow): never {
	const message = err instanceof Error ? err.message : String(err);

	if (message.includes('users.emailReportEmail')) {
		throw createHttpError(
			400,
			`duplicate key error: a user with email "${
				user.emailReportEmail || ''
			}" already exists`
		);
	}

	if (message.includes('users.expoReportExpoPushToken')) {
		throw createHttpError(
			400,
			`duplicate key error: a user with expoPushToken "${
				user.expoReportExpoPushToken || ''
			}" already exists`
		);
	}

	throw err;
}

const COLUMNS = `_id, timezone, lastStationId, emailReportEmail,
	emailReportFrequency, expoReportExpoPushToken, expoReportFrequency,
	createdAt, updatedAt`;

export const User = {
	/**
	 * Create a user from a request body.
	 */
	create(body: unknown): DbUser {
		const row = validate(isPlainObject(body) ? body : {});

		try {
			getDb()
				.prepare(
					`INSERT INTO users (${COLUMNS}) VALUES (
						:_id, :timezone, :lastStationId, :emailReportEmail,
						:emailReportFrequency, :expoReportExpoPushToken,
						:expoReportFrequency, :createdAt, :updatedAt
					)`
				)
				.run({ ...row });
		} catch (err) {
			rethrowConstraint(err, row);
		}

		return toUser(row);
	},

	/**
	 * Apply a PATCH body to an existing user, revalidating the result.
	 */
	update(current: DbUser, body: unknown): DbUser {
		const merged = mergePatch(
			toInput(current),
			isPlainObject(body) ? body : {}
		);
		const row = validate(merged);

		// `validate` mints a new id and a fresh `createdAt` for what it treats
		// as a new document; on an update the stored ones stand.
		row._id = current._id;
		row.createdAt = current.createdAt;

		try {
			// Only the columns the statement names: `node:sqlite` rejects a
			// named parameter the SQL does not use, so `row` cannot be spread
			// in wholesale.
			getDb()
				.prepare(
					`UPDATE users SET
						timezone = :timezone,
						lastStationId = :lastStationId,
						emailReportEmail = :emailReportEmail,
						emailReportFrequency = :emailReportFrequency,
						expoReportExpoPushToken = :expoReportExpoPushToken,
						expoReportFrequency = :expoReportFrequency,
						updatedAt = :updatedAt
					WHERE _id = :_id`
				)
				.run({
					_id: row._id,
					timezone: row.timezone,
					lastStationId: row.lastStationId,
					emailReportEmail: row.emailReportEmail,
					emailReportFrequency: row.emailReportFrequency,
					expoReportExpoPushToken: row.expoReportExpoPushToken,
					expoReportFrequency: row.expoReportFrequency,
					updatedAt: row.updatedAt,
				});
		} catch (err) {
			rethrowConstraint(err, row);
		}

		return toUser(row);
	},

	findById(id: string): DbUser | null {
		const row = getDb()
			.prepare(`SELECT ${COLUMNS} FROM users WHERE _id = ?`)
			.get(id) as UserRow | undefined;

		return row ? toUser(row) : null;
	},

	findByExpoPushToken(expoPushToken: string): DbUser | null {
		const row = getDb()
			.prepare(
				`SELECT ${COLUMNS} FROM users WHERE expoReportExpoPushToken = ?`
			)
			.get(expoPushToken) as UserRow | undefined;

		return row ? toUser(row) : null;
	},

	/**
	 * Delete a user, returning what was deleted so the route can 404 on a miss
	 * and echo the document back on a hit, as `findOneAndDelete` did.
	 */
	deleteById(id: string): DbUser | null {
		const user = User.findById(id);

		if (!user) {
			return null;
		}

		getDb().prepare('DELETE FROM users WHERE _id = ?').run(id);

		return user;
	},

	/**
	 * Empty the table. Used by the e2e specs between suites.
	 */
	deleteAll(): void {
		getDb().prepare('DELETE FROM users').run();
	},
};
