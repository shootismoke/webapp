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

function performSearch(
	startPage: string,
	searchInput: string,
	expectedUrl: string
): void {
	// FIXME This test passes locally, but doesn't pass in CI.
	// https://github.com/shootismoke/webapp/issues/36
	it.skip(
		`should search for ${searchInput} and redirect to ${expectedUrl}`,
		{
			// Algolia sometimes take a long time on CI.
			defaultCommandTimeout: 10000,
		},
		() => {
			cy.visit(startPage);

			cy.get('[data-cy=SearchBar-AsyncSelect] input').type(searchInput);

			// See https://stackoverflow.com/questions/55046835/select-react-select-dropdown-list-option-using-cypress
			cy.get('[data-cy=SearchBar-AsyncSelect]')
				.get('[class*="-menu"]')
				.find('[class*="-option"]')
				.first()
				.click({ force: true });

			cy.url().should('have.string', expectedUrl);
		}
	);
}

export function searchCityWithSlug(startPage: string): void {
	performSearch(startPage, 'paris', '/city/paris');
}

export function searchCityWithGps(startPage: string): void {
	performSearch(
		startPage,
		'notre dame de paris',
		'/city?lat=48.7767&lng=1.96212'
	);
}
