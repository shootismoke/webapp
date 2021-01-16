/*
    This file is part of Sh**t! I Smoke.
    Copyright (C) 2018-2021  Marcelo S. Coelho, Amaury Martiny
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.
    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

declare module '*.jpg' {
	export default img as string;
}

declare module '*.jpeg' {
	export default img as string;
}

declare module '*.png' {
	export default img as string;
}

declare module '*.svg' {
	export default img as string;
}

declare module '*.webp' {
	export default img as string;
}

// The following packages don't have typings.
declare module 'assign-deep';

// https://github.com/mailgun/mailgun-js/issues/19#issuecomment-689303499
declare module 'mailgun.js' {
	interface ClientOpts {
		username: string;
		key: string;
	}

	interface MailgunClient {
		messages: {
			create(
				domain: string,
				opts: CreateMessageOpts
			): Promise<{ id: string; message: string }>;
		};
	}

	interface CreateMessageOpts {
		from: string;
		to: string;
		subject: string;
		text: string;
		html: string;
		'o:tag'?: string[];
	}

	export function client(opts: ClientOpts): MailgunClient;
}
