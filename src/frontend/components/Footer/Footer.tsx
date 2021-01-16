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

import logo from '@shootismoke/ui/assets/logos/logo.svg';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { logEvent } from '../../util';

export function Footer(): React.ReactElement {
	return (
		<footer className="mt-20 md:mt-32 px-10 py-8 md:py-12 bg-gray-700 flex flex-col items-center">
			<div className="next-images relative h-10 | w-10">
				<Image
					alt="logo"
					layout="fill"
					objectFit="contain"
					src={logo}
				/>
			</div>

			<p className="mt-4 type-200 text-center text-white">
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
			<p className="mt-8 type-100 text-center text-white">
				<a
					className="text-orange"
					href="https://facebook.com/shootismoke"
					onClick={(): void => logEvent('Footer.Facebook.Click')}
					rel="noreferrer"
					target="_blank"
				>
					Facebook
				</a>
				<span className="mx-4">|</span>
				<a
					className="text-orange"
					href="https://twitter.com/shootismoke"
					onClick={(): void => logEvent('Footer.Twitter.Click')}
					rel="noreferrer"
					target="_blank"
				>
					Twitter
				</a>
				<span className="mx-4">|</span>
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

			<p className="mt-4 type-100 text-center text-white">
				Learn more about the initiative in our{' '}
				<Link href="/faq">
					<a
						className="text-orange"
						onClick={(): void => logEvent('Footer.Faq.Click')}
					>
						F.A.Q.
					</a>
				</Link>
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
