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
 * Hand a trusted contributor a working `.env` without handing them the
 * deploy vault.
 *
 *   node scripts/dev-secrets.js seal    # .env            -> dev.env.enc
 *   node scripts/dev-secrets.js open    # dev.env.enc     -> .env
 *
 * Deliberately dependency-free, and Node rather than openssl/gpg/ansible:
 * every contributor already has the Node in .nvmrc, and nothing else here is
 * installed on a stock macOS or Windows machine.
 *
 * This is NOT the deploy vault, and must never grow into it. Ansible's
 * vault.yml holds production credentials, and a contributor running the site
 * locally has no use for any of them. Only SHARED_KEYS below travels, so the
 * blast radius of a leaked passphrase is a rate limit, not a credential. See
 * deploy/README.md for the real vault.
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const ROOT = path.join(__dirname, '..');
const ENV_FILE = path.join(ROOT, '.env');
const ENC_FILE = path.join(ROOT, 'dev.env.enc');

/**
 * The only keys that travel. Anything absent from this list stays on the
 * machine that has it.
 *
 * The two NEXT_PUBLIC_* values are compiled into the client bundle, so they
 * are already public to anyone who loads the site; they are here for
 * completeness rather than secrecy. The three BACKEND_* are real credentials,
 * rate-limited per key -- worth issuing dev-tier keys for, so a contributor
 * exhausting a quota cannot affect production.
 */
const SHARED_KEYS = [
	'NEXT_PUBLIC_AMPLITUDE_API_KEY',
	'NEXT_PUBLIC_SENTRY_API_KEY',
	'BACKEND_AQICN_TOKEN',
	'BACKEND_GEOAPIFY_API_KEY',
	'BACKEND_OPENAQ_API_KEY',
];

/**
 * Written on `open` rather than shared, because they are not secrets: they
 * are what "local" means. BACKEND_SECRET only has to match between this app's
 * frontend and its own /api routes.
 */
const LOCAL_DEFAULTS = {
	BACKEND_SQLITE_PATH: '.data/shootismoke.db',
	BACKEND_SECRET: 'ssshhh!',
};

/**
 * scrypt at N=2^17 costs ~1s and a few hundred MB per guess. That is the
 * whole defence if the ciphertext is committed to this public repository: an
 * attacker gets unlimited offline guesses, so the passphrase has to be
 * generated rather than chosen. `openssl rand -base64 24` is the right shape.
 */
const SCRYPT = { N: 131072, maxmem: 512 * 1024 * 1024, p: 1, r: 8 };
const FORMAT = 'shootismoke-dev-secrets-v1';

function parseEnv(text) {
	const out = {};

	for (const line of text.split('\n')) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith('#')) continue;

		const eq = trimmed.indexOf('=');
		if (eq === -1) continue;

		out[trimmed.slice(0, eq)] = trimmed.slice(eq + 1);
	}

	return out;
}

function readPassphrase(confirm) {
	const fromEnv = process.env.DEV_SECRETS_PASSPHRASE;
	if (fromEnv) return Promise.resolve(fromEnv);

	if (!process.stdin.isTTY) {
		throw new Error(
			'No TTY to prompt on. Set DEV_SECRETS_PASSPHRASE instead.'
		);
	}

	// readline echoes what it reads, so mute stdout for the duration and
	// print the prompt ourselves.
	const ask = (label) =>
		new Promise((resolve) => {
			const rl = readline.createInterface({
				input: process.stdin,
				output: process.stdout,
				terminal: true,
			});

			process.stdout.write(label);
			const muted = rl.output.write.bind(rl.output);
			rl.output.write = () => true;

			rl.question('', (answer) => {
				rl.output.write = muted;
				process.stdout.write('\n');
				rl.close();
				resolve(answer);
			});
		});

	return ask('Passphrase: ').then(async (first) => {
		if (!confirm) return first;

		const second = await ask('Confirm: ');
		if (first !== second) throw new Error('Passphrases do not match.');

		return first;
	});
}

function deriveKey(passphrase, salt) {
	return new Promise((resolve, reject) => {
		crypto.scrypt(passphrase, salt, 32, SCRYPT, (err, key) =>
			err ? reject(err) : resolve(key)
		);
	});
}

async function seal() {
	if (!fs.existsSync(ENV_FILE)) {
		throw new Error(`No ${ENV_FILE} to read.`);
	}

	const env = parseEnv(fs.readFileSync(ENV_FILE, 'utf8'));
	const missing = SHARED_KEYS.filter((key) => !env[key]);
	if (missing.length) {
		throw new Error(`.env is missing or empty for: ${missing.join(', ')}`);
	}

	const passphrase = await readPassphrase(true);
	const salt = crypto.randomBytes(32);
	const iv = crypto.randomBytes(12);
	const key = await deriveKey(passphrase, salt);

	const plaintext = SHARED_KEYS.map((k) => `${k}=${env[k]}`).join('\n');
	const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
	const body = Buffer.concat([
		cipher.update(plaintext, 'utf8'),
		cipher.final(),
	]);

	fs.writeFileSync(
		ENC_FILE,
		[
			FORMAT,
			salt.toString('base64'),
			iv.toString('base64'),
			cipher.getAuthTag().toString('base64'),
			body.toString('base64'),
		].join('\n') + '\n'
	);

	console.log(`Sealed ${SHARED_KEYS.length} keys into ${rel(ENC_FILE)}`);
}

async function open() {
	if (!fs.existsSync(ENC_FILE)) {
		throw new Error(`No ${rel(ENC_FILE)}. Ask whoever ran \`seal\`.`);
	}

	const [format, salt, iv, tag, body] = fs
		.readFileSync(ENC_FILE, 'utf8')
		.trim()
		.split('\n');

	if (format !== FORMAT) {
		throw new Error(`Unrecognised format "${format}".`);
	}

	const passphrase = await readPassphrase(false);
	const key = await deriveKey(passphrase, Buffer.from(salt, 'base64'));

	const decipher = crypto.createDecipheriv(
		'aes-256-gcm',
		key,
		Buffer.from(iv, 'base64')
	);
	decipher.setAuthTag(Buffer.from(tag, 'base64'));

	let plaintext;
	try {
		plaintext = Buffer.concat([
			decipher.update(Buffer.from(body, 'base64')),
			decipher.final(),
		]).toString('utf8');
	} catch {
		// GCM cannot tell a wrong key from a corrupted file, and in practice
		// it is always the passphrase.
		throw new Error('Wrong passphrase (or the file has been modified).');
	}

	// Never clobber a .env silently: it may hold credentials that were never
	// in the sealed set, and there is no undo.
	if (fs.existsSync(ENV_FILE)) {
		const backup = `${ENV_FILE}.backup`;
		fs.copyFileSync(ENV_FILE, backup);
		// The backup holds every credential the old .env did, including ones
		// outside SHARED_KEYS. It is gitignored; keep it off other accounts
		// on this machine too.
		fs.chmodSync(backup, 0o600);
		console.log(`Existing .env copied to ${rel(backup)}`);
	}

	const local = Object.entries(LOCAL_DEFAULTS)
		.map(([k, v]) => `${k}=${v}`)
		.join('\n');

	fs.writeFileSync(
		ENV_FILE,
		`# Written by scripts/dev-secrets.js -- do not commit.\n` +
			`${plaintext}\n\n# Local, not shared.\n${local}\n`,
		{ mode: 0o600 }
	);
	// `mode` above only applies when writeFileSync creates the file, and it
	// usually will not have.
	fs.chmodSync(ENV_FILE, 0o600);

	console.log(`Wrote ${rel(ENV_FILE)}. Run: npm run dev`);
}

function rel(file) {
	return path.relative(ROOT, file);
}

const command = process.argv[2];

(command === 'seal' ? seal() : command === 'open' ? open() : usage()).catch(
	(err) => {
		console.error(`error: ${err.message}`);
		process.exit(1);
	}
);

function usage() {
	console.error('usage: node scripts/dev-secrets.js seal|open');
	return Promise.resolve().then(() => process.exit(1));
}
