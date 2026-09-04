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

import type { DbUser } from '@common/ui';
import debug from 'debug';
import createHttpError from 'http-errors';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const l = debug('shootismoke:db');

/**
 * Where the database file lives when `BACKEND_SQLITE_PATH` is unset.
 *
 * An unset path is not an error. There is no credential to get wrong and no
 * server to reach, so a fresh checkout with no `.env` at all still serves
 * `/api/users`. Deployments set the variable explicitly and point it outside
 * the git checkout, where a release cannot overwrite it.
 */
const DEFAULT_PATH = '.data/shootismoke.db';

/**
 * A user is one row. The API nests the two subscriptions as `emailReport` and
 * `expoReport` objects, but they are stored as flat columns, because an
 * address and a push token each have to be unique across the whole table and
 * a unique index cannot reach inside a JSON value.
 *
 * Both indexes are partial. A user with no email subscription stores `NULL`,
 * and `NULL`s are exempt from a partial index -- otherwise the second
 * unsubscribed user would collide with the first.
 *
 * Timestamps are ISO 8601 text so `JSON.stringify` hands them to a client
 * unchanged, with no date type to serialise on the way out.
 */
const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
	_id                      TEXT PRIMARY KEY,
	timezone                 TEXT NOT NULL,
	lastStationId            TEXT NOT NULL,
	emailReportEmail         TEXT,
	emailReportFrequency     TEXT,
	expoReportExpoPushToken  TEXT,
	expoReportFrequency      TEXT,
	createdAt                TEXT NOT NULL,
	updatedAt                TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique
	ON users (emailReportEmail)
	WHERE emailReportEmail IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS users_expo_push_token_unique
	ON users (expoReportExpoPushToken)
	WHERE expoReportExpoPushToken IS NOT NULL;
`;

let db: DatabaseSync | undefined;

/**
 * Open the database, creating the file and the schema on first use.
 *
 * Synchronous by design: `node:sqlite` has no async API, and every query here
 * is a primary-key or unique-index lookup against a table of a few thousand
 * rows. There is no connection to pool and nothing to await.
 *
 * The handle is cached for the life of the process. Next's dev server reloads
 * modules on edit, so treat re-entry as normal rather than as a bug.
 */
export function getDb(): DatabaseSync {
	if (db) {
		return db;
	}

	const path = resolve(process.env.BACKEND_SQLITE_PATH || DEFAULT_PATH);

	// The deploy role creates /var/lib/shootismoke/{prod,staging} itself; this
	// is for the default path in a fresh checkout, where `.data/` does not
	// exist yet.
	mkdirSync(dirname(path), { recursive: true });

	db = new DatabaseSync(path);

	// The e2e specs open the same file from a second process to seed and clear
	// fixtures while the server holds it. WAL lets a reader and a writer
	// coexist; the rollback journal would deadlock them.
	db.exec('PRAGMA journal_mode = WAL');
	db.exec('PRAGMA foreign_keys = ON');
	db.exec(SCHEMA);

	l('Opened db at %s.', path);

	return db;
}

/**
 * Close the handle, so a test process can exit without leaking it.
 */
export function closeDb(): void {
	if (!db) {
		return;
	}

	db.close();
	db = undefined;

	l('Closed db.');
}

/**
 * Assert that we have a user.
 */
export function assertUser(
	user: DbUser | null,
	id: string
): asserts user is DbUser {
	if (!user) {
		throw createHttpError(404, `No user with "${id}" found`);
	}
}
