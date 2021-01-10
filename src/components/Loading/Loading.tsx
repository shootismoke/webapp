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

import React from 'react';

// import { Cigarettes } from '../Cigarettes';
import { H1 } from '../H1';
import { HeroLayout } from '../HeroLayout';

interface LoadingProps {
	className?: string;
}

export function Loading(props: LoadingProps): React.ReactElement {
	const { className } = props;

	return (
		<div className={className}>
			<HeroLayout
				// cover={<Cigarettes cigarettes={1.1} />}
				cover={<div>HELLO</div>}
				title={
					<H1>
						<>
							Loading...{' '}
							<span className="text-orange">
								cough... cough...
							</span>
						</>
					</H1>
				}
			/>
		</div>
	);
}
