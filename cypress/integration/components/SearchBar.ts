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

export function searchCityWithSlug(startPage: string): void {
	it('should search for a city and redirect to correct slug', () => {
		cy.visit(startPage);

		cy.get('[data-cy=SearchBar-AsyncSelect]')
			.should('be.visible')
			.click()
			.type('paris')
			// See https://stackoverflow.com/questions/55046835/select-react-select-dropdown-list-option-using-cypress
			.get('[class*="-menu"]')
			.find('[class*="-option"]')
			.first()
			.click();

		cy.url().should('have.string', '/city/paris');
	});
}

export function searchCityWithGps(startPage: string): void {
	it('should search for a city and redirect to city page with gps', () => {
		cy.visit(startPage);

		cy.get('[data-cy=SearchBar-AsyncSelect]')
			.should('be.visible')
			.click()
			.type('notre dame de paris')
			// See https://stackoverflow.com/questions/55046835/select-react-select-dropdown-list-option-using-cypress
			.get('[class*="-menu"]')
			.find('[class*="-option"]')
			.first()
			.click();

		cy.url().should('have.string', '/city/?lat=48.7767&lng=1.96212');
	});
}
