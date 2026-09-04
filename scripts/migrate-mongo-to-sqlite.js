#!/usr/bin/env node
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

/**
 * One-shot: copy the `users` collection out of MongoDB Atlas into the SQLite
 * file that replaced it.
 *
 *   npm install --no-save mongodb
 *   node scripts/migrate-mongo-to-sqlite.js --uri "mongodb+srv://..." --out prod.db
 *
 * Run it on a laptop, not on the deploy box: the Atlas connection string is a
 * production credential, and the point of this migration is to stop having one
 * of those on the box at all. Copy the resulting file up afterwards --
 * see deploy/README.md for the cutover.
 *
 * `mongodb` is installed with --no-save on purpose. It is not a dependency of
 * the app any more, and adding it back for a script that runs twice would put
 * it in every production install.
 *
 * The app never writes `pushTickets`, so that collection is not carried over;
 * push and email delivery were retired along with Mongo.
 */

const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

/**
 * Kept in step with `SCHEMA` in src/backend/util/db.ts, which is the source of
 * truth -- this script only exists to pre-fill a file the app then opens.
 * The app's `CREATE TABLE IF NOT EXISTS` will not reshape a table that is
 * already there, so a divergence here shows up as a query error on the first
 * request rather than as silent data loss.
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

function parseArgs(argv) {
	const args = { db: 'shootismoke', force: false };

	for (let i = 0; i < argv.length; i += 1) {
		const arg = argv[i];

		if (arg === '--force') {
			args.force = true;
		} else if (arg === '--uri' || arg === '--out' || arg === '--db') {
			args[arg.slice(2)] = argv[(i += 1)];
		} else {
			usage(`unknown argument: ${arg}`);
		}
	}

	if (!args.uri) usage('--uri is required');
	if (!args.out) usage('--out is required');

	return args;
}

function usage(message) {
	console.error(`error: ${message}

usage: node scripts/migrate-mongo-to-sqlite.js --uri <mongodb-uri> --out <file.db>
                                               [--db <name>] [--force]

  --uri    MongoDB connection string, e.g. the prod value from vault.yml
  --out    SQLite file to write; refuses to overwrite without --force
  --db     database name inside the cluster (default: shootismoke)
  --force  overwrite --out if it already exists`);
	process.exit(1);
}

/**
 * Flatten one Mongo document into a row.
 *
 * A report subdocument with no address or token is dropped rather than stored
 * half-populated: Mongo let one exist as `{ frequency: 'never' }`, which the
 * SQLite schema has no way to spell and the app would read back as "no
 * subscription" anyway.
 */
function toRow(doc) {
	const now = new Date().toISOString();
	const iso = (value) =>
		value instanceof Date ? value.toISOString() : value || now;

	const email = doc.emailReport && doc.emailReport.email;
	const token = doc.expoReport && doc.expoReport.expoPushToken;

	return {
		_id: String(doc._id),
		timezone: doc.timezone,
		lastStationId: doc.lastStationId,
		emailReportEmail: email || null,
		emailReportFrequency: email
			? doc.emailReport.frequency || 'never'
			: null,
		expoReportExpoPushToken: token || null,
		expoReportFrequency: token ? doc.expoReport.frequency || 'never' : null,
		createdAt: iso(doc.createdAt),
		updatedAt: iso(doc.updatedAt),
	};
}

async function main() {
	const args = parseArgs(process.argv.slice(2));
	const out = path.resolve(args.out);

	if (fs.existsSync(out) && !args.force) {
		usage(`${out} already exists (pass --force to overwrite)`);
	}

	let MongoClient;
	try {
		({ MongoClient } = require('mongodb'));
	} catch {
		console.error(
			'error: the `mongodb` package is not installed.\n' +
				'It is deliberately not a dependency of this app. Install it ' +
				'just for this run:\n\n  npm install --no-save mongodb\n'
		);
		process.exit(1);
	}

	if (fs.existsSync(out)) {
		// Including the -wal and -shm sidecars, which would otherwise be
		// replayed into the fresh file.
		for (const suffix of ['', '-wal', '-shm']) {
			fs.rmSync(`${out}${suffix}`, { force: true });
		}
	}

	const db = new DatabaseSync(out);
	db.exec(SCHEMA);

	const insert = db.prepare(`
		INSERT INTO users (
			_id, timezone, lastStationId, emailReportEmail,
			emailReportFrequency, expoReportExpoPushToken,
			expoReportFrequency, createdAt, updatedAt
		) VALUES (
			:_id, :timezone, :lastStationId, :emailReportEmail,
			:emailReportFrequency, :expoReportExpoPushToken,
			:expoReportFrequency, :createdAt, :updatedAt
		)`);

	const client = new MongoClient(args.uri);
	await client.connect();

	const cursor = client.db(args.db).collection('users').find({});

	let read = 0;
	let inserted = 0;
	const skipped = [];

	for await (const doc of cursor) {
		read += 1;

		try {
			insert.run(toRow(doc));
			inserted += 1;
		} catch (err) {
			// A duplicate email or token means Mongo's sparse unique index was
			// not enforcing what we assumed; a NOT NULL failure means a
			// document predates a required field. Either way, report it rather
			// than aborting a migration that is 99% good.
			skipped.push({ _id: String(doc._id), reason: err.message });
		}
	}

	await client.close();
	db.close();

	console.log(`read     ${read} documents from ${args.db}.users`);
	console.log(`inserted ${inserted} rows into ${out}`);
	console.log(`skipped  ${skipped.length}`);

	for (const { _id, reason } of skipped) {
		console.log(`  ${_id}: ${reason}`);
	}

	if (skipped.length) {
		// Non-zero, so a cutover script cannot mistake a partial copy for a
		// clean one.
		process.exit(2);
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
