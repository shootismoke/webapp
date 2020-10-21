// Sh**t! I Smoke
// Copyright (C) 2018-2020  Marcelo S. Coelho, Amaury Martiny

// Sh**t! I Smoke is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Sh**t! I Smoke is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Sh**t! I Smoke.  If not, see <http://www.gnu.org/licenses/>.

import logo from '@shootismoke/ui/assets/logos/logo.svg';
import React from 'react';

import { logEvent } from '../../util';

export function Footer(): React.ReactElement {
	return (
		<footer className="mt-16 px-10 py-8 lg:py-12 bg-gray-700 flex flex-col items-center">
			<img alt="logo" className="w-10" src={logo}></img>
			<p className="mt-3 text-sm text-center text-white">
				Created with pride by{' '}
				<a
					className="text-orange"
					href="https://www.marcelocoelho.cc"
					onClick={(): void => logEvent('Footer.Marcelo.Click')}
					rel="noreferrer"
					target="_blank"
				>
					Marcelo S. Coelho
				</a>{' '}
				&amp;{' '}
				<a
					className="text-orange"
					href="https://amaurymartiny.com"
					onClick={(): void => logEvent('Footer.Amaury.Click')}
					rel="noreferrer"
					target="_blank"
				>
					Amaury Martiny
				</a>
				.
			</p>
			<p className="mt-8 text-xs text-center text-white">
				<a
					className="text-orange"
					href="https://facebook.com/shootismoke"
					onClick={(): void => logEvent('Footer.Facebook.Click')}
					rel="noreferrer"
					target="_blank"
				>
					Facebook
				</a>
				<span className="mx-3">|</span>
				<a
					className="text-orange"
					href="https://twitter.com/shootismoke"
					onClick={(): void => logEvent('Footer.Twitter.Click')}
					rel="noreferrer"
					target="_blank"
				>
					Twitter
				</a>
				<span className="mx-3">|</span>
				<a
					className="text-orange"
					href="mailto:hi@shootismoke.app"
					onClick={(): void => logEvent('Footer.Email.Click')}
					rel="noreferrer"
					target="_blank"
				>
					Email
				</a>{' '}
			</p>

			<p className="mt-4 text-xs text-center text-white">
				Learn more about the initiative in our{' '}
				<a
					className="text-orange"
					href="https://github.com/shootismoke/webapp"
					onClick={(): void => logEvent('Footer.Faq.Click')}
					rel="noreferrer"
					target="_blank"
				>
					F.A.Q.
				</a>
				<br />
				Source code available on{' '}
				<a
					className="text-orange"
					href="https://github.com/shootismoke/webapp"
					onClick={(): void => logEvent('Footer.Github.Click')}
					rel="noreferrer"
					target="_blank"
				>
					Github
				</a>
				.
			</p>
		</footer>
	);
}
